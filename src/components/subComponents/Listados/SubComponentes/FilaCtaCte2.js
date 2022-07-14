import React, { useState } from 'react'
import { Button, Spinner } from 'reactstrap'
import moment from 'moment';
import formatMoney from 'Function/NumberFormat';
import axios from 'axios';
import UrlNodeServer from 'api/NodeServer';
import swal from 'sweetalert';
import FileSaver from 'file-saver';
import CompleteCerosLeft from 'Function/CompleteCeroLeft';

const FilaCtaCte = ({
    id,
    item,
    actualizar
}) => {
    const [wait, setWait] = useState(false)

    const getFact = async (idFact, importe) => {
        let query = ""
        let urlGet = UrlNodeServer.invoicesDir.sub.factDataPDF
        if (importe > 0) {
            urlGet = UrlNodeServer.clientesDir.sub.payments
        }
        setWait(true)
        await axios.get(urlGet + "/" + idFact + query, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                Accept: 'application/pdf',
            }
        })
            .then(res => {
                let headerLine = res.headers['content-disposition'];
                const largo = parseInt(headerLine.length)
                let filename = headerLine.substring(21, largo);
                var blob = new Blob([res.data], { type: "application/pdf" });
                FileSaver.saveAs(blob, filename);
                swal("Reimpresión de factura", "Factura reimpresa con éxito!", "success");
            })
            .catch(error => {
                console.error(error);
                swal("Reimpresión de factura", "Hubo un error al querer reimprimir la factura!", "error");
            }).finally(() => {
                setWait(false)
            })
    }

    return (
        <>
            <tr key={id} style={parseFloat(item.t_fact) === -2 ? { backgroundColor: "#d2d2d2" } : {}}>
                <td style={{ textAlign: "center" }}>
                    {moment(item.create_time).format("DD/MM/YYYY H:mm")} Hs
                </td>
                <td style={{ textAlign: "center" }}>
                    {
                        wait ?
                            <Spinner color={"danger"} />
                            :
                            <Button onClick={e => {
                                e.preventDefault()
                                getFact(item.id, parseFloat(item.importe))
                            }} color={"danger"}>
                                Ver
                            </Button>
                    }
                </td>
                <td style={{ textAlign: "center" }}>
                    {`${item.letra} ${CompleteCerosLeft(item.pv, 5)}-${CompleteCerosLeft(item.cbte, 8)}`}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.total_fact - item.monto_cta_cte)}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.comision)}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.comision_paga)}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.comision - item.comision_paga)}
                </td>
            </tr>
        </>
    )
}

export default FilaCtaCte