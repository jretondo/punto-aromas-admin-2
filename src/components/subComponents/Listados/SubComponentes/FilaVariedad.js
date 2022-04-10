import React from 'react'
const FilaVariedad = ({
    id,
    item,
    setListaVar
}) => {

    const quitar = () => {
        setListaVar(listaVar => {
            listaVar.splice(id, 1)
            return [...listaVar]
        })
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.variedad}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.cod_barra}
            </td>

            <td>
                <button className='btn btn-danger' style={{ borderRadius: "50%" }} onClick={e => {
                    e.preventDefault()
                    quitar()
                }} >
                    X
                </button>
            </td>
        </tr>
    )
}

export default FilaVariedad