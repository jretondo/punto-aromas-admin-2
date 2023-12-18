import formatMoney from 'Function/NumberFormat';
import React, { useContext, useState } from 'react';
import { Button } from 'reactstrap';
import productSellContext from '../../../../context/productsSell';
import ModalChangePrice from './ModalChangePrice';

const FilaProdSell = ({
    id,
    item
}) => {
    const [modalChange, setModalChange] = useState(false)
    const { RemoveProduct, modifyPrice } = useContext(productSellContext)

    return (
        <>
            <tr key={id}>
                <td style={{ textAlign: "center" }}>
                    {item.name} ({item.subcategory})
                </td>
                <td style={{ textAlign: "center" }}>
                    {item.cant_prod}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.price)}
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.price / (1 + (item.iva / 100)) * item.cant_prod)}
                </td>
                <td style={{ textAlign: "center" }}>
                    {item.iva}%
                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney(item.price * item.cant_prod)}
                </td>
                <td style={{ textAlign: "center" }}>
                    <Button color="primary" onClick={e => {
                        e.preventDefault()
                        setModalChange(true)
                    }}>
                        {item.prices.type_price_name}
                    </Button>
                </td>
                <td className="text-right">
                    <button
                        onClick={() => RemoveProduct(item.key)}
                        className='btn btn-danger' style={{ round: "50%" }}>
                        X
                    </button>
                </td>
            </tr>
            <ModalChangePrice
                modal={modalChange}
                toggle={() => setModalChange(!modalChange)}
                item={item}
                modifyPrice={modifyPrice}
            />
        </>
    )
}

export default FilaProdSell