import formatMoney from 'Function/NumberFormat';
import moment from 'moment';
import React from 'react';

const FilaDetCtacte = ({
    id,
    item
}) => {
    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {moment(item.fecha).format("DD/MM/YYYY")}
            </td>
            <td style={{ textAlign: "center" }}>
                {parseInt(item.t_fact) === -1 ?
                    "Pago parcial de factura" :
                    parseInt(item.t_fact) === -2 ?
                        "Pago de comisión" :
                        "Compra de productos"
                }
            </td>
            <td style={
                parseInt(item.t_fact) === -2 ?
                    { textAlign: "center", color: "red" } :
                    { textAlign: "center", color: "green" }}>
                $ {parseInt(item.t_fact) >= 0 ? formatMoney(item.comision) : formatMoney(item.comision)}
            </td>
        </tr>
    )
}

export default FilaDetCtacte