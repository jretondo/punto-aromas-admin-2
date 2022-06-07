import UrlNodeServer from 'api/NodeServer'
import React, { useEffect } from 'react'
import { Col, FormFeedback, FormGroup, Input, Label } from 'reactstrap'
import { verificadorCuit } from 'Function/VerificadorCuit'
import axios from 'axios'

const NdocInput = ({
    tipoDoc,
    ndoc,
    setNdoc,
    setRazSoc,
    invalidNdoc,
    setInvalidNdoc,
    ptoVta,
    setCondIvaCli,
    colSize,
    setEsperar,
    setDomicilio
}) => {
    const Find = async () => {
        if (parseInt(tipoDoc) === 96) {
            const largo = ndoc.length
            if (largo > 8 || largo < 7) {
                setInvalidNdoc(true)
            } else {
                setInvalidNdoc(false)
            }
        } else {
            const esCuit = verificadorCuit(ndoc).isCuit
            if (esCuit) {
                setInvalidNdoc(false)
            } else {
                setInvalidNdoc(true)
            }
        }
    }

    const getDataFiscalClient = async () => {
        const verifCuit = await verificadorCuit(ndoc)
        if (ptoVta.cert_file && ptoVta.key_file && verifCuit.isCuit) {
            setEsperar(true)
            const query = `?cuit=${ndoc}&cert=${ptoVta.cert_file}&key=${ptoVta.key_file}&cuitPv=${ptoVta.cuit}`
            await axios.get(UrlNodeServer.clientesDir.sub.dataFiscal + query, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            })
                .then(res => {
                    const respuesta = res.data
                    const status = respuesta.status
                    if (status === 200) {
                        if (respuesta.body.status === 200) {
                            if (respuesta.body.data.datosGenerales.domicilioFiscal) {
                                //console.log('respuesta.body.data.datosGenerales.domicilioFiscal :>> ', respuesta.body.data.datosGenerales.domicilioFiscal);

                                let direccion = ""
                                let provincia = ""
                                let localidad = ""
                                if (respuesta.body.data.datosGenerales.domicilioFiscal.direccion) {
                                    direccion = respuesta.body.data.datosGenerales.domicilioFiscal.direccion + " - "
                                }
                                if (respuesta.body.data.datosGenerales.domicilioFiscal.descripcionProvincia) {
                                    provincia = respuesta.body.data.datosGenerales.domicilioFiscal.descripcionProvincia
                                }
                                if (respuesta.body.data.datosGenerales.domicilioFiscal.localidad) {
                                    localidad = ((respuesta.body.data.datosGenerales.domicilioFiscal.localidad).replace("*", "")).trim() + " - "
                                }

                                setDomicilio(`${direccion}${localidad}${provincia}`)

                            }
                            if (respuesta.body.data.datosMonotributo) {
                                setRazSoc(respuesta.body.data.datosGenerales.nombre + " " + respuesta.body.data.datosGenerales.apellido)
                                setCondIvaCli(6)
                            } else {
                                if (respuesta.body.data.datosGenerales.nombre) {
                                    setRazSoc(respuesta.body.data.datosGenerales.nombre + " " + respuesta.body.data.datosGenerales.apellido)
                                } else {
                                    setRazSoc(respuesta.body.data.datosGenerales.razonSocial)
                                }
                                const impuesto = respuesta.body.data.datosRegimenGeneral.impuesto
                                const iva = impuesto.find(imp => imp.idImpuesto === 30);
                                if (iva !== undefined) {
                                    setCondIvaCli(1)
                                } else {

                                    setCondIvaCli(4)
                                }
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log('error :>> ', error);
                }).finally(() => setEsperar(false))

        } else {
        }
    }

    useEffect(() => {
        Find()
        // eslint-disable-next-line
    }, [tipoDoc, ndoc])

    useEffect(() => {
        try {
            document.getElementById("ndocNewClient").addEventListener("blur", getDataFiscalClient)
            return () => document.getElementById("ndocNewClient").removeEventListener("blur", getDataFiscalClient)
        } catch (error) {

        }
        // eslint-disable-next-line
    }, [ndoc, tipoDoc])

    return (
        <Col md={colSize}>
            <Label for="ndocNewClient">{parseInt(tipoDoc) === 80 ? "Nº CUIT" : "Nº Doc."}</Label>
            <FormGroup>
                <Input
                    required
                    invalid={invalidNdoc}
                    type="number"
                    id="ndocNewClient"
                    value={ndoc}
                    onChange={e => setNdoc(e.target.value)}
                    onBlur={() => Find()}
                />
                <FormFeedback>{parseInt(tipoDoc) === 80 ? "El CUIT no es válido. Reviselo!" : "El DNI no es válido. Reviselo!"}</FormFeedback>
            </FormGroup>
        </Col>
    )
}

export default NdocInput