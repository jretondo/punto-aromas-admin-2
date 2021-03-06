import React, { useState } from 'react'
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Spinner, UncontrolledDropdown } from 'reactstrap'
import moment from 'moment';
import formatMoney from 'Function/NumberFormat';
import axios from 'axios';
import UrlNodeServer from 'api/NodeServer';
import swal from 'sweetalert';
import FileSaver from 'file-saver';
import ModalDetCtaCte from './modalDetCtaCte';

const FilaCtaCte = ({
    id,
    item,
    actualizar
}) => {
    const [wait, setWait] = useState(false)
    const [modal, setModal] = useState(false)

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
            <tr key={id}>
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
                    $ {formatMoney(item.total_fact)}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney((item.total_fact - item.monto_cta_cte) + item.monto_pago_cta_cte)}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.monto_cta_cte - item.monto_pago_cta_cte)}
                </td>
                <td className="text-right">
                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                        >
                            <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => {
                                    e.preventDefault()
                                    setModal(true)
                                }}
                            >
                                <i className="fas fa-search"></i>
                                Ver detalles
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>
            <ModalDetCtaCte
                modal={modal}
                toggle={() => setModal(!modal)}
                item={item}
                actualizarOriginal={actualizar}
            />
        </>
    )
}

export default FilaCtaCte