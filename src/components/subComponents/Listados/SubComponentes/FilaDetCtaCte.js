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
                {parseInt(item.t_fact) >= 0 ? "Compra de productos" : "Pago de cliente"}
            </td>
            <td style={parseInt(item.t_fact) >= 0 ? { textAlign: "center", color: "red" } : { textAlign: "center", color: "green" }}>
                $ {parseInt(item.t_fact) >= 0 ? formatMoney(item.monto_cta_cte) : formatMoney(item.monto_cta_cte)}
            </td>
        </tr>
    )
}

export default FilaDetCtacte