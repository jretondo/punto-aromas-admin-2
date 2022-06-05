import formatMoney from 'Function/NumberFormat';
import React from 'react';

const FilaPrecioSelect = ({
    id,
    item,
    data,
    cant,
    addToCart
}) => {

    const SelectPrice = (dataItem) => {
        addToCart(data, cant, dataItem)
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.type_price_name}
            </td>
            <td style={{ textAlign: "center" }}>
                {formatMoney(item.sell_price)}
            </td>
            <td className="text-right">
                <button
                    onClick={() => SelectPrice(item)}
                    className='btn btn-success'>
                    <i className="fas fa-check" ></i>
                </button>
            </td>
        </tr>
    )
}

export default FilaPrecioSelect