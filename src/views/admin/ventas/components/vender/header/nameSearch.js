import UrlNodeServer from '../../../../../../api/NodeServer'
import axios from 'axios'
import React, { useState } from 'react'
import { Input, Spinner } from 'reactstrap'

const NameSearch = ({
    setTipoDoc,
    setNdoc,
    setRazSoc,
    setEmailCliente,
    setEnvioEmailBool,
    setInvalidNdoc,
    setClienteData,
    razSoc,
}) => {
    const [loading, setLoading] = useState(false)

    const Find = async () => {
        setLoading(true)
        await axios.get(`${UrlNodeServer.clientesDir.clientes}/${1}`, {
            params: {
                search: razSoc,
                cantPerPage: 15
            },
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const body = respuesta.body
                    if (body.pagesObj.totalPag > 0) {

                        const cliente = body.data[0]
                        setClienteData(cliente)
                        let tipoCliente = parseInt(cliente.cuit)
                        if (tipoCliente === 0) {
                            tipoCliente = 80
                        } else {
                            tipoCliente = 96
                        }
                        setInvalidNdoc(false)
                        setTipoDoc(tipoCliente)
                        setNdoc(cliente.ndoc)
                        setRazSoc(cliente.razsoc)
                        if (cliente.email.length > 0) {
                            setEmailCliente(cliente.email)
                            setEnvioEmailBool(1)
                        }
                    } else {
                        setClienteData({ id: 0, price_default: "" })
                        setEmailCliente("")
                        setEnvioEmailBool(0)
                    }
                } else {
                    setClienteData({ id: 0, price_default: "" })
                    setEmailCliente("")
                    setEnvioEmailBool(0)
                }
            })
            .catch(() => {
                setClienteData({ id: 0, price_default: "" })
                setEmailCliente("")
                setEnvioEmailBool(0)
            })
    }

    const keyenterPress = (e) => {
        if (e.key === 'Enter') {
            Find()
        }
    }

    return (
        <>
            {loading ?
                <Spinner />
                :
                <Input
                    type="text"
                    id="razSocTxt"
                    value={razSoc}
                    onChange={e => setRazSoc(e.target.value)}
                    onKeyPress={keyenterPress}
                    required
                />}
        </>
    )
}

export default NameSearch