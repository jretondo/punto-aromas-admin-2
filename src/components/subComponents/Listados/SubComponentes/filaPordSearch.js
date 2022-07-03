import React from 'react';

const FilaProdSearch = ({
    id,
    item,
    setProdText,
    prodSearchToggle,
    findProd
}) => {
    const SelectProd = (prod) => {
        prodSearchToggle()
        setProdText("id:" + prod.id_prod)
        findProd("id:" + prod.id_prod)
    }
    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.name}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.category}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.subcategory}
            </td>
            <td className="text-right">
                <button
                    onClick={() => SelectProd(item)}
                    className='btn btn-success'>
                    <i className="fas fa-check" ></i>
                </button>
            </td>
        </tr>
    )
}

export default FilaProdSearch