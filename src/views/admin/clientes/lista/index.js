import React, { useState, useEffect } from 'react';
import Paginacion from 'components/subComponents/Paginacion/Paginacion'
import BusquedaForm from 'components/subComponents/Productos/BusquedaForm'
import ListadoTable from 'components/subComponents/Listados/ListadoTable'
import FilaProveedores from 'components/subComponents/Listados/SubComponentes/FilaClientes'
import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label,
    Spinner
} from "reactstrap"
import ModalSellers from './modalSellers';
import NdocInput from './ndocInput';



const ListaClientesMod = ({
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setNvaActCall,
    setActividadStr,
    setVerCtaCteBool,
    setNombreCtaCte,
    setIdCtaCte,
    call,
    setCall,
    nvaActCall,
    alertar,
    isAdmin
}) => {
    const [detallesBool, setDetallesBool] = useState(false)
    const [nvoProveedor, setNvoProveedor] = useState(false)

    //Search word   
    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")

    //lists and UseFetch   
    const [pagina, setPagina] = useState(1)
    const [ultimaPag, setUltimaPag] = useState(0)
    const [plantPaginas, setPlantPaginas] = useState(<></>)
    const [listado, setListado] = useState([])
    const [dataList, setDataList] = useState([])

    //FormProveedor Basic Info
    const [nvoTipoDoc, setNvoTipoDoc] = useState(80)
    const [nvoDoc, setNvoDoc] = useState("")
    const [nvoRazSoc, setNvoRazSoc] = useState("")
    const [nvoTelefono, setNvoTelefono] = useState("")
    const [nvoEmail, setNvoEmail] = useState("")
    const [nvoCondIva, setNvoCondIva] = useState(0)
    const [idDetalle, setIdDetalle] = useState(0)
    const [vendedorId, setVendedorId] = useState(null)

    const [invalidNdoc, setInvalidNdoc] = useState(false)
    const [ptoVta, setPtoVta] = useState({ id: 0 })
    const [listaVendedores, setListaVendedores] = useState(<option value={null}>No hay vendedores para asignar</option>)
    const [esperar, setEsperar] = useState(false)

    const [modalSellers, setModalSellers] = useState(false)
    const [clienteSelect, setClienteSelect] = useState({})
    const [domicilio, setDomicilio] = useState("")
    const [priceDefault, setPriceDefault] = useState(null)

    const [deudaClientes, setDeudaClientes] = useState(0)

    const NvoProv = (e) => {
        e.preventDefault()
        setNvoProveedor(true)
    }

    const CancelaNvoProv = (e) => {
        e.preventDefault()
        ResetForm()
        setNvoProveedor(false)
        setDetallesBool(false)
        setCall(!call)
    }

    const NvoProveedorForm = async (e, update) => {
        e.preventDefault()

        const datos = {
            cuit: parseInt(nvoTipoDoc) === 96 ? 1 : 0,
            ndoc: nvoDoc,
            razsoc: nvoRazSoc,
            telefono: nvoTelefono,
            email: nvoEmail,
            cond_iva: nvoCondIva,
            direccion: domicilio
        }
        if (vendedorId !== null) {
            datos.vendedor_id = vendedorId
        }
        if (priceDefault !== null) {
            datos.price_default = priceDefault
        }
        if (update) {
            datos.id = idDetalle
        }
        if (invalidNdoc) {
            setMsgStrong("Documento inválido!")
            setMsgGralAlert("Controle el número de documento del cliente!")
            setSuccessAlert(false)
            setAlertar(!alertar)
        } else {
            setEsperar(true)
            await axios.post(UrlNodeServer.clientesDir.clientes, datos, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            })
                .then(res => {
                    setEsperar(false)
                    const respuesta = res.data
                    const status = parseInt(respuesta.status)
                    if (status === 200) {
                        if (update) {
                            setActividadStr("El usuario ha modificado al cliente '" + nvoRazSoc + "'")
                            setNvaActCall(!nvaActCall)
                            setMsgStrong("Cliente modificado con éxito!")
                        } else {
                            setActividadStr("El usuario ha agregado al cliente '" + nvoRazSoc + "'")
                            setNvaActCall(!nvaActCall)
                            setMsgStrong("Cliente agregado con éxito!")
                        }
                        setMsgGralAlert("")
                        setSuccessAlert(true)
                        setAlertar(!alertar)
                        ResetForm()
                    } else {
                        setMsgStrong("hubo un error! ")
                        setMsgGralAlert("intente nuevamente")
                        setSuccessAlert(false)
                        setAlertar(!alertar)
                    }
                })
                .catch(() => {
                    setEsperar(false)
                    setMsgStrong("hubo un error! ")
                    setMsgGralAlert("intente nuevamente")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                })
        }
    }

    const ListaProveedores = async () => {
        let urlNode = UrlNodeServer.clientesDir.clientes
        if (parseInt(deudaClientes) === 1) {
            urlNode = UrlNodeServer.clientesDir.sub.clientesDeudas
        }
        setEsperar(true)
        await axios.get(`${urlNode}/${pagina}`, {
            params: {
                search: palabraBuscada
            },
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const body = respuesta.body
                    setDataList(body.pagesObj)
                    setUltimaPag(body.pagesObj.totalPag)
                    if (parseInt(body.pagesObj.totalPag) > 0) {
                        setListado(
                            body.data.map((item, key) => {
                                let primero
                                if (key === 0) {
                                    primero = true
                                } else {
                                    primero = false
                                }
                                return (
                                    <FilaProveedores
                                        id={key}
                                        key={key}
                                        item={item}
                                        setActividadStr={setActividadStr}
                                        nvaActCall={nvaActCall}
                                        setNvaActCall={setNvaActCall}
                                        alertar={alertar}
                                        setAlertar={setAlertar}
                                        setMsgStrong={setMsgStrong}
                                        setMsgGralAlert={setMsgGralAlert}
                                        setSuccessAlert={setSuccessAlert}
                                        setCall={setCall}
                                        call={call}
                                        setEsperar={setEsperar}
                                        setDetallesBool={setDetallesBool}
                                        setIdDetalle={setIdDetalle}
                                        primero={primero}
                                        pagina={pagina}
                                        setPagina={setPagina}
                                        setVerCtaCteBool={setVerCtaCteBool}
                                        setIdCtaCte={setIdCtaCte}
                                        setNombreCtaCte={setNombreCtaCte}
                                        setClienteSelect={setClienteSelect}
                                        toggleSellerAsign={() => setModalSellers(true)}
                                        modal={modalSellers}
                                        deuda={deudaClientes}
                                        isAdmin={isAdmin}
                                    />
                                )
                            })
                        )
                    } else {
                        setUltimaPag(1)
                        setListado(
                            <tr style={{ textAlign: "center", width: "100%" }}>
                                <td>
                                    <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes cargados</span>
                                </td>
                            </tr>
                        )
                    }
                } else {
                    setUltimaPag(1)
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes cargados</span>
                            </td>
                        </tr>
                    )
                }
            })
            .catch((error) => {
                console.log('error :>> ', error);
                setEsperar(false)
                setUltimaPag(1)
                setListado(
                    <tr style={{ textAlign: "center", width: "100%" }}>
                        <td>
                            <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes cargados</span>
                        </td>
                    </tr>
                )
            })
    }

    const DetallesProvFunc = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.clientesDir.sub.details}/${idDetalle}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const body = respuesta.body[0]
                    if (parseInt(body.cuit) === 1) {
                        setNvoTipoDoc(96)
                    } else {
                        setNvoTipoDoc(80)
                    }
                    setNvoDoc(body.ndoc)
                    setNvoRazSoc(body.razsoc)
                    setNvoTelefono(body.telefono)
                    setNvoEmail(body.email)
                    setNvoCondIva(body.cond_iva)
                    setDomicilio(body.direccion)
                    setVendedorId(body.vendedor_id)
                    setPriceDefault(body.price_default)
                } else {
                    setMsgStrong("Hubo un error! ")
                    setMsgGralAlert("Intente nuevamenete")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setEsperar(false)
                setMsgStrong("Hubo un error! ")
                setMsgGralAlert("Intente nuevamenete")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const getPv = async () => {
        await axios.get(UrlNodeServer.ptosVtaDir.sub.userPv, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const ptoVtaData = respuesta.body.data
                    setPtoVta(ptoVtaData[0])
                } else {

                }
            }).catch((error) => { console.log('error :>> ', error); })
    }

    const getVendedores = async () => {
        await axios.get(UrlNodeServer.usuariosDir.sub.sellers, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const sellerList = respuesta.body.data
                if (sellerList.length > 0) {
                    setListaVendedores(
                        // eslint-disable-next-line
                        sellerList.map((item, key) => {
                            if (key === 0) {
                                return (
                                    <>
                                        <option value={null} key={-1}>No asignar ningún vendedor</option>
                                        <option value={item.id} key={key}>{`${item.nombre} ${item.apellido}`}</option>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <option value={item.id} key={key}>{`${item.nombre} ${item.apellido}`}</option>
                                    </>
                                )
                            }
                        })
                    )
                } else {
                    setListaVendedores(<option value={null}>No hay vendedores para asignar</option>)
                }
            } else {
                setListaVendedores(<option value={null}>No hay vendedores para asignar</option>)
            }
        }).catch(error => {
            setListaVendedores(<option value={null}>No hay vendedores para asignar</option>)
        })
    }

    const ResetForm = () => {
        setNvoDoc("")
        setNvoTipoDoc(0)
        setNvoRazSoc("")
        setNvoCondIva(0)
        setNvoEmail("")
        setNvoTelefono("")
        setDomicilio("")
        setPriceDefault(null)
        setVendedorId(null)
    }

    useEffect(() => {
        ListaProveedores()
        // eslint-disable-next-line
    }, [call, pagina, deudaClientes])

    useEffect(() => {
        if (detallesBool) {
            DetallesProvFunc()
        }
        // eslint-disable-next-line
    }, [detallesBool])
    useEffect(() => {
        getPv()
        getVendedores()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            {
                esperar ?
                    <div style={{ textAlign: "center", marginTop: "100px" }}>
                        <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                    <>
                        <Row style={
                            detallesBool ?
                                { display: "none" } :
                                nvoProveedor ?
                                    { display: "none" } :
                                    { display: "block" }}>
                            <Col>
                                <Card className="shadow">
                                    <CardHeader className="border-0">
                                        <Row>
                                            <Col md="4" >
                                                <h2 className="mb-0">Lista de Clientes</h2>
                                                <Input type="select" value={deudaClientes} onChange={e => {
                                                    setDeudaClientes(e.target.value)
                                                }} >
                                                    <option value={0}>Todos</option>
                                                    <option value={1}>Con deuda</option>
                                                </Input>
                                            </Col>
                                            <Col md="8" style={{ textAlign: "right" }}>
                                                <BusquedaForm
                                                    setPage={setPagina}
                                                    busquedaBool={busquedaBool}
                                                    setPalabraBuscada={setPalabraBuscada}
                                                    palabraBuscada={palabraBuscada}
                                                    setBusquedaBool={setBusquedaBool}
                                                    call={call}
                                                    setCall={setCall}
                                                    titulo="Buscar un Cliente"
                                                />
                                            </Col>
                                        </Row>

                                    </CardHeader>

                                    <ListadoTable
                                        listado={listado}
                                        titulos={parseInt(deudaClientes) === 1 ? ["Razón Social", "Nº Doc.", "Telefóno", "Email", "Total Deuda", ""] : ["Razón Social", "Nº Doc.", "Telefóno", "Email", "Cond. IVA", ""]}
                                    />
                                    <CardFooter className="py-4">
                                        <nav aria-label="..." style={{ marginBottom: "20px" }}>
                                            <button
                                                className="btn btn-primary"
                                                style={nvoProveedor ? { display: "none" } : { display: "block" }}
                                                onClick={e => NvoProv(e)}
                                            >
                                                Nuevo Cliente
                                            </button>
                                        </nav>
                                        <Paginacion
                                            setPagina={setPagina}
                                            setCall={setCall}
                                            pagina={pagina}
                                            call={call}
                                            plantPaginas={plantPaginas}
                                            ultimaPag={ultimaPag}
                                            data={dataList}
                                            setPlantPaginas={setPlantPaginas}
                                            setUltimaPag={setUltimaPag}
                                        />
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                        <Row style={
                            detallesBool ?
                                { display: "block", marginTop: "25px" } :
                                !nvoProveedor ?
                                    { display: "none", marginTop: "25px" } :
                                    { display: "block", marginTop: "25px" }} >
                            <Col className="order-xl-1" md="12">
                                <Card className="bg-secondary shadow">
                                    <CardHeader className="bg-white border-0">
                                        <Row className="align-items-center">
                                            <Col xs="9">
                                                {
                                                    detallesBool ?
                                                        <h3 className="mb-0">{nvoRazSoc}</h3> :
                                                        <h3 className="mb-0">Nuevo Cliente</h3>
                                                }

                                            </Col>
                                            <Col xs="3" style={{ textAlign: "right" }}>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={e => CancelaNvoProv(e)}
                                                > x
                                                </button>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBody>
                                        <Form onSubmit={detallesBool ? e => NvoProveedorForm(e, true) : e => NvoProveedorForm(e)}>
                                            <h6 className="heading-small text-muted mb-4">
                                                Información del Cliente
                                            </h6>
                                            <Row>
                                                <Col lg="2">
                                                    <FormGroup>
                                                        <Label for="exampleSelect">Tipo. Doc.</Label>
                                                        <Input type="select" value={nvoTipoDoc} onChange={e => setNvoTipoDoc(e.target.value)}>
                                                            <option value={80}>CUIT</option>
                                                            <option value={96}>DNI</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <NdocInput
                                                    tipoDoc={nvoTipoDoc}
                                                    ndoc={nvoDoc}
                                                    setTipoDoc={setNvoTipoDoc}
                                                    setNdoc={setNvoDoc}
                                                    setRazSoc={setNvoRazSoc}
                                                    setEmailCliente={setNvoEmail}
                                                    invalidNdoc={invalidNdoc}
                                                    setInvalidNdoc={setInvalidNdoc}
                                                    ptoVta={ptoVta}
                                                    setCondIvaCli={setNvoCondIva}
                                                    colSize={6}
                                                    setEsperar={setEsperar}
                                                    setDomicilio={setDomicilio}
                                                />
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <Label for="exampleSelect">Cond. IVA</Label>
                                                        <Input type="select" value={nvoCondIva} onChange={e => setNvoCondIva(e.target.value)}>
                                                            <option value={0}>Cons. Final</option>
                                                            {
                                                                parseInt(nvoTipoDoc) === 80 ?
                                                                    <>  <option value={1}>Res. Inscripto</option>
                                                                        <option value={4}>Exento</option>
                                                                        <option value={6}>Monotributista</option></> : null
                                                            }
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label
                                                            className="form-control-Label"
                                                            htmlFor="input-username"
                                                        >
                                                            {
                                                                parseInt(nvoTipoDoc) === 80 ?
                                                                    "Razón Social" : "Nombre Completo"
                                                            }
                                                        </Label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-username"
                                                            placeholder={parseInt(nvoTipoDoc) === 80 ? "Razón Social..." : "Nombre y Apellido..."}
                                                            type="text"
                                                            value={nvoRazSoc}
                                                            onChange={e => setNvoRazSoc(e.target.value)}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                        <Label>
                                                            Dirección
                                                        </Label>
                                                        <Input value={domicilio} onChange={e => setDomicilio(e.target.value)} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label>
                                                            Vendedores
                                                        </Label>
                                                        {
                                                            parseInt(isAdmin) === 1 ?
                                                                <Input value={vendedorId} onChange={e => setVendedorId(e.target.value)} type="select" >
                                                                    {listaVendedores}
                                                                </Input> : <Input type="text" value="Usted no tiene los permisos para cambiar este campo." disabled />
                                                        }

                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                        <Label>
                                                            Precio por defecto
                                                        </Label>
                                                        <Input value={priceDefault} onChange={e => setPriceDefault(e.target.value)} type="select" >
                                                            <option value={null}>Sin precios por defecto</option>
                                                            <option value={"minorista"}>Minorista</option>
                                                            <option value={"mayorista_1"}>Mayorista 1</option>
                                                            <option value={"mayorista_2"}>Mayorista 2</option>
                                                            <option value={"mayorista_3"}>Mayorista 3</option>
                                                            <option value={"revendedor"}>Revendedor</option>
                                                            <option value={"supermercado"}>Supermercado</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col lg="8">
                                                    <FormGroup>
                                                        <Label
                                                            className="form-control-Label"
                                                            htmlFor="input-username"
                                                        >
                                                            Email
                                                        </Label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-username"
                                                            placeholder="Casilla de email..."
                                                            type="email"
                                                            value={nvoEmail}
                                                            onChange={e => setNvoEmail(e.target.value)}

                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <Label
                                                            className="form-control-Label"
                                                            htmlFor="input-username"
                                                        >
                                                            Telefóno
                                                        </Label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-username"
                                                            placeholder="Telefóno..."
                                                            type="text"
                                                            value={nvoTelefono}
                                                            onChange={e => setNvoTelefono(e.target.value)}

                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: "15px" }}>
                                                <Col lg="12" style={{ textAlign: "center" }}>
                                                    <FormGroup>
                                                        <button
                                                            className="btn btn-warning"
                                                            type="submit"
                                                        >
                                                            {
                                                                detallesBool ?
                                                                    "Aplicar Cambios" :
                                                                    "Agregar Nuevo Cliente"
                                                            }
                                                        </button>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <ModalSellers
                            modal={modalSellers}
                            toggle={() => setModalSellers(!modalSellers)}
                            clienteItem={clienteSelect}
                            reload={() => setCall(!call)}
                        />
                    </>
            }
        </>
    )
}

export default ListaClientesMod