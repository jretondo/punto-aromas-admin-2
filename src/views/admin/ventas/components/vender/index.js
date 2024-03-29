import React, { useState, useContext, useEffect } from "react";
import UrlNodeServer from '../../../../../api/NodeServer'
import {
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Row,
    Spinner
} from "reactstrap";
import './styles.css'
import InvoiceHeader from "./header";
import ProductFinder from "./productFinder";
import ProdListSell from "./list/prodListSell";
import productsSellContext from '../../../../../context/productsSell';
import formatMoney from "Function/NumberFormat";
import swal from "sweetalert";
import moment from "moment";
import axios from "axios";
import FileSaver from 'file-saver'
import { verificadorCuit } from "Function/VerificadorCuit";
import ModalChange from "./modalChange";
import FormasPagoMod from "./formasPago";

const Ventas = ({
    setValidPV
}) => {
    const [clienteBool, setClienteBool] = useState(1)
    const [factFiscBool, setFactFiscBool] = useState(0)
    const [tipoDoc, setTipoDoc] = useState(80)
    const [ptoVta, setPtoVta] = useState({ id: 0 })
    const [envioEmailBool, setEnvioEmailBool] = useState(0)
    const [emailCliente, setEmailCliente] = useState("")
    const [ndoc, setNdoc] = useState("")
    const [razSoc, setRazSoc] = useState("")

    const [formaPago, setFormaPago] = useState(0)
    const [invalidNdoc, setInvalidNdoc] = useState(false)
    const [tfact, setTfact] = useState(1)
    const [condIvaCli, setCondIvaCli] = useState(0)
    const [processing, setProcessing] = useState(false)
    const [descuentoPerc, setDescuentoPer] = useState(0)
    const [variosPagos, setVariosPagos] = useState([])
    const [total, setTotal] = useState(0)
    const [costoEnvio, setCostoEnvio] = useState(0)

    const [totalFinal, setTotalFinal] = useState(0)

    const [clienteData, setClienteData] = useState({ id: 0, price_default: "" })

    const [modal1, setModal1] = useState(false)

    const { totalPrecio, cancelarCompra, productsSellList, setProductsSellList } = useContext(productsSellContext)

    const cancelar = () => {
        swal({
            title: "¿Está seguro de canelar la compra?",
            text: "Esta desición elimibará todos los productos cargados en el carrito de compras.",
            icon: "warning",
            dangerMode: true,
            buttons: ["Cancelar", "Vacíar Carrito"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    setClienteBool(0)
                    setEnvioEmailBool(0)
                    cancelarCompra()
                }
            });
    }

    const generarFactura = async () => {
        let data
        if (parseInt(clienteBool) === 0) {
            data = {
                dataFact: {
                    fecha: moment(new Date()).format("YYYY-MM-DD"),
                    pv_id: ptoVta.id,
                    fiscal: factFiscBool,
                    forma_pago: formaPago,
                    cond_iva: condIvaCli,
                    enviar_email: envioEmailBool,
                    cliente_email: emailCliente,
                    lista_prod: productsSellList,
                    descuentoPerc: descuentoPerc,
                    variosPagos: variosPagos,
                    costoEnvio: costoEnvio
                },
                fiscal: factFiscBool
            }
        } else {
            data = {
                dataFact: {
                    fecha: moment(new Date()).format("YYYY-MM-DD"),
                    pv_id: ptoVta.id,
                    fiscal: factFiscBool,
                    forma_pago: formaPago,
                    cond_iva: condIvaCli,
                    enviar_email: envioEmailBool,
                    cliente_email: emailCliente,
                    cliente_bool: parseInt(clienteBool),
                    cliente_tdoc: tipoDoc,
                    cliente_ndoc: ndoc,
                    cliente_name: razSoc,
                    lista_prod: productsSellList,
                    descuentoPerc: descuentoPerc,
                    variosPagos: variosPagos,
                    costoEnvio: costoEnvio
                },
                fiscal: factFiscBool
            }
        }
        if (parseInt(formaPago) === 5 && parseFloat(total) !== parseFloat(totalPrecio)) {
            swal("Error: Total del pago!", "Revise que el total del pago debe ser igual al total de la factura.", "error");
        } else {
            if (totalPrecio > 15795 && parseInt(clienteBool) === 0 && parseInt(factFiscBool) === 1) {
                swal("Error: Consumidor Final!", "Cuando el importe supere los $15.795,00 se tendrá que identificar el consumidor final si o si por exigencias de AFIP.", "error");
            } else {
                if (productsSellList.length > 0) {
                    if (parseInt(clienteBool) === 1) {
                        if (parseInt(tipoDoc) === 96) {
                            const largo = ndoc.length
                            if (largo > 8 || largo < 7) {
                                swal("Error en el DNI!", "El DNI que trata de cargar es inválido! Reviselo.", "error");
                            } else {
                                facturar(data)
                            }
                        } else {
                            const esCuit = verificadorCuit(ndoc).isCuit
                            if (esCuit) {
                                facturar(data)
                            } else {
                                swal("Error en el CUIT!", "El CUIT que trata de cargar es inválido! Reviselo.", "error");
                            }
                        }
                    } else {
                        facturar(data)
                    }
                } else {
                    swal("Error en el carrito!", "No hay productos para facturar! Controlelo.", "error");
                }
            }
        }

    }

    const facturar = async (data) => {
        productsSellList.sort((a, b) => {
            return (a.id_prod - b.id_prod)
        })
        let idAnt = -1
        let priceAnt = -1
        let newList = []
        productsSellList.map((item) => {
            if (item.id_prod !== idAnt || item.price !== priceAnt) {
                newList.push(item)
            } else {
                newList[(newList.length - 1)].cant_prod = newList[(newList.length - 1)].cant_prod + item.cant_prod
            }
            idAnt = item.id_prod
            priceAnt = item.price
        })


        newList.map(async (item, key) => {
            let cargar = true
            await axios.get(UrlNodeServer.stockDir.sub.totalStock + "?id_prod=" + item.id_prod, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            }).then(res => {
                const stock = res.data.body
                if ((stock - item.cant_prod) < 0) {
                    swal("Error en stock!", `La cantidad de ${item.name} (${item.subcategory}) que colocó es de ${item.cant_prod} y el stock es de ${stock}`, "error");
                    throw Error("Error en stock")
                }
            }).catch(async (err) => {
                cargar = false
            }).finally(() => { })

            if (newList.length - 1 === key) {
                if (cargar) {
                    createPDF(data)
                }
            }
        })
    }

    const createPDF = async (data) => {
        setProcessing(true)
        await axios.post(UrlNodeServer.invoicesDir.invoices, data, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                Accept: 'application/pdf',
            },
            timeout: 15000
        }).then(res => {
            if (parseInt(formaPago) === 0) {
                setModal1(true)
            }
            let headerLine = res.headers['content-disposition'];
            const largo = parseInt(headerLine.length)
            let filename = headerLine.substring(21, largo);
            var blob = new Blob([res.data], { type: "application/pdf" });
            FileSaver.saveAs(blob, filename);
            cancelarCompra()
            setDescuentoPer(0)
            setFormaPago(0)
            setFactFiscBool(0)
            setEnvioEmailBool(0)
            setClienteBool(1)
            setFactFiscBool(0)
            setTipoDoc(80)

            setEnvioEmailBool(0)
            setEmailCliente("")
            setNdoc("")
            setRazSoc("")

            setVariosPagos([])
            if (envioEmailBool) {
                swal("Nueva Factura!", "La factura se ha generado con éxito y pronto le llegará al cliente por email!", "success");
            } else {
                swal("Nueva Factura!", "La factura se ha generado con éxito!", "success");
            }
        }).catch(async (err) => {
            console.log('object :>> ', err);
            if (err.code === 'ECONNABORTED') {
                await swal("Tiempo de espera superado!", "Ha tardado demasiado el servidor en responder. En breve se generará la factura y la podrá ver reflejada consultando en el sistema.", "error");
                await swal("Le mandaremos un email en cuanto se genere la factura.", "", "info");
            } else {
                swal("Error inesperado!", "La factura no se pudo generar por un error en los datos! Controle que no falten datos importantes en la cabecera", "error");
            }
        }).finally(() => { setProcessing(false) })
    }

    useEffect(() => {
        setTotalFinal(parseFloat(totalPrecio) - ((parseFloat(totalPrecio)) * (descuentoPerc / 100)) + parseFloat(costoEnvio))
    }, [costoEnvio, totalPrecio, descuentoPerc])

    return (
        <Card >
            <ModalChange
                modal={modal1}
                toggle={() => setModal1(!modal1)}
                totalFinal={totalFinal}
            />
            <CardBody>
                {
                    processing ?
                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ color: "green" }}>Procesando Factura...</h2>
                            <Spinner type="grow" color="light" style={{ width: "250px", height: "250px" }} /> </div> :
                        <>
                            <InvoiceHeader
                                setPtoVta={setPtoVta}
                                setFactFiscBool={setFactFiscBool}
                                setClienteBool={setClienteBool}
                                setTipoDoc={setTipoDoc}
                                setNdoc={setNdoc}
                                setRazSoc={setRazSoc}
                                setEmailCliente={setEmailCliente}
                                setEnvioEmailBool={setEnvioEmailBool}
                                setFormaPago={setFormaPago}
                                factFiscBool={factFiscBool}
                                clienteBool={clienteBool}
                                tipoDoc={tipoDoc}
                                ndoc={ndoc}
                                razSoc={razSoc}
                                formaPago={formaPago}
                                envioEmailBool={envioEmailBool}
                                emailCliente={emailCliente}
                                ptoVta={ptoVta}
                                invalidNdoc={invalidNdoc}
                                setInvalidNdoc={setInvalidNdoc}
                                tfact={tfact}
                                setTfact={setTfact}
                                setCondIvaCli={setCondIvaCli}
                                setValidPV={setValidPV}
                                setModal1={setModal1}
                                modal1={modal1}
                                setClienteData={setClienteData}
                            />

                            <br />

                            <ProductFinder
                                clienteData={clienteData}
                                clienteBool={clienteBool}
                            />

                            <ProdListSell />
                            <Row>
                                <Col md="6">
                                    <FormasPagoMod
                                        clienteBool={clienteBool}
                                        formaPago={formaPago}
                                        variosPagos={variosPagos}
                                        setVariosPagos={setVariosPagos}
                                        factFiscBool={factFiscBool}
                                        total={total}
                                        setTotal={setTotal}
                                    />
                                </Col>
                                <Col md="6">
                                    <Row style={{ marginTop: 0 }}>
                                        <Col md="4" style={{ marginLeft: "auto", textAlign: "right" }}>
                                            <Label style={{ fontSize: "25px", fontWeight: "bold" }} >
                                                Subtotal:
                                            </Label>
                                        </Col>
                                        <Col md="8" >
                                            <FormGroup>
                                                <Input style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }} type="text" value={"$ " + formatMoney(totalPrecio)} disabled />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 0 }}>
                                        <Col md="4" style={{ marginLeft: "auto", textAlign: "right" }}>
                                            <Label style={{ fontSize: "25px", fontWeight: "bold" }} >
                                                Envío:
                                            </Label>
                                        </Col>
                                        <Col md="8" >
                                            <FormGroup>
                                                <Input style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }} type="text" onChange={e => setCostoEnvio(e.target.value)} value={costoEnvio} />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 0 }}>
                                        <Col md="4" style={{ marginLeft: "auto", textAlign: "right" }}>
                                            <Label style={{ fontSize: "25px", fontWeight: "bold" }} >
                                                Descuento:
                                            </Label>
                                        </Col>
                                        <Col md="8" >
                                            <FormGroup>
                                                <Row>
                                                    <Col md="4" >
                                                        <InputGroup>
                                                            <Input style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }} type="text" value={descuentoPerc} onChange={e => setDescuentoPer(e.target.value)} min={0} max={100} />
                                                            <InputGroupAddon addonType="append">%</InputGroupAddon>
                                                        </InputGroup>
                                                    </Col>
                                                    <Col md="8">
                                                        <Input style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }} type="text" value={"$ " + formatMoney(((parseFloat(-totalPrecio)) * (descuentoPerc / 100)))} disabled />
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 0 }}>
                                        <Col md="4" style={{ marginLeft: "auto", textAlign: "right" }}>
                                            <Label style={{ fontSize: "25px", fontWeight: "bold" }} >
                                                Total:
                                            </Label>
                                        </Col>
                                        <Col md="8" >
                                            <FormGroup>
                                                <Input style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }} type="text" value={"$ " + formatMoney(totalFinal)} disabled />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 0, textAlign: "center" }}>
                                <Col>
                                    <button
                                        className="btn btn-primary"
                                        style={{ margin: "15px", width: "200px" }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            generarFactura()
                                        }}>
                                        Confirmar Compra
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        style={{ margin: "15px", width: "200px" }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            cancelar()
                                        }}>
                                        Cancelar
                                    </button>
                                </Col>
                            </Row>
                        </>
                }
            </CardBody>
        </Card>)


}

export default Ventas;
