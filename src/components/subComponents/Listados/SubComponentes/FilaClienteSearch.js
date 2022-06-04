import React from 'react'

const FilaClientesSearch = ({
    id,
    item,
    setTipoDoc,
    setEmailCliente,
    setNdoc,
    setRazSoc,
    cuitSearchToggle,
    setEnvioEmailBool
}) => {

    const SelectCuit = (i) => {
        setNdoc(i.ndoc)
        setTipoDoc(i.cuit)
        setEmailCliente(i.email)
        setRazSoc(i.razsoc)
        console.log(`i.email`, i.email)
        console.log(`objeci.email.lengtht`, i.email.length)
        if (i.email.length > 0) {
            setEnvioEmailBool(1)
        } else {
            setEnvioEmailBool(0)
        }
        cuitSearchToggle()
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {parseInt(item.tipoDoc) === 0 ?
                    "CUIT " + item.ndoc :
                    "DNI " + item.ndoc
                }
            </td>
            <td style={{ textAlign: "center" }}>
                {item.razsoc}
            </td>
            <td style={{ textAlign: "center" }}>
                {parseInt(item.cond_iva) === 1 ?
                    "Res. Inscripto" : parseInt(item.cond_iva) === 6 ?
                        "Monotributista" : parseInt(item.cond_iva) === 4 ? "Exento" : "Cons. Final"
                }
            </td>
            <td style={{ textAlign: "center" }}>
                <button
                    className='btn btn-warning'
                    onClick={e => {
                        e.preventDefault();
                        SelectCuit(item);
                    }}
                >
                    Seleccionar
                </button>
            </td>
        </tr>
    )
}

export default FilaClientesSearch