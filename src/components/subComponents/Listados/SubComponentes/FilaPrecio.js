import formatMoney from 'Function/NumberFormat'
import React from 'react'
const FilaPrecio = ({
    id,
    item,
    setListaPrecios,
    muestra
}) => {

    const quitar = () => {
        setListaPrecios(listaPrecios => {
            listaPrecios.splice(id, 1)
            return [...listaPrecios]
        })
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.type_price_name}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.percentage_sell} %
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.sell_price)}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.min}
            </td>
            {
                muestra ? null :
                    <td>
                        <button className='btn btn-danger' style={{ borderRadius: "50%" }} onClick={e => {
                            e.preventDefault()
                            quitar()
                        }} >
                            X
                        </button>
                    </td>
            }
        </tr>
    )
}

export default FilaPrecio