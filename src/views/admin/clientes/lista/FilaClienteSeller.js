import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const FilaSeller = ({
    id,
    item,
    selectSeller,
    unSelectSeller,
    asignado
}) => {
    const [tooltipOpen, setToolTipOpen] = useState(false)
    const selectUser = (dataSeller) => {
        selectSeller(dataSeller)
    }
    const unSelectUser = (dataSeller) => {
        unSelectSeller(dataSeller)
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "left" }}>
                {`${item.nombre} ${item.apellido}`}
            </td>
            <td style={{ textAlign: "left" }}>
                {`${item.email}`}
            </td>
            <td style={{ textAlign: "center" }}>
                {`${item.pv}`}
            </td>
            <td className="text-right">
                {
                    parseInt(item.id) === parseInt(asignado) ?
                        <>
                            <button
                                onClick={() => unSelectUser(item)}
                                className='btn btn-danger'
                                id={'btnAsign' + item.id}>
                                <i className="fas fa-times" ></i>
                            </button>
                            <Tooltip placement="right" isOpen={tooltipOpen} target={'btnAsign' + item.id} toggle={() => setToolTipOpen(!tooltipOpen)} >
                                Quitar como vendedor de este cliente
                            </Tooltip>
                        </>

                        :
                        <>
                            <button
                                onClick={() => selectUser(item)}
                                className='btn btn-success'
                                id={'btnAsign' + item.id}>
                                <i className="fas fa-check" ></i>
                            </button>
                            <Tooltip toggle={() => setToolTipOpen(!tooltipOpen)} placement="right" isOpen={tooltipOpen} target={'btnAsign' + item.id}>
                                Agregar como vendedor de este cliente
                            </Tooltip>
                        </>
                }
            </td>
        </tr>
    )
}

export default FilaSeller