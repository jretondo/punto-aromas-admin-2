import { useEffect, useState } from 'react';
import ProdSellContext from './index';
import React from 'react';
import moment from 'moment';
import swal from 'sweetalert';

const ProdSellProvider = ({ children }) => {
    const [productsSellList, setProductsSellList] = useState([])
    const [totalPrecio, setTotalPrecio] = useState(0)
    const [totalRevende, setTotalRevende] = useState(0)
    const [error, setError] = useState()

    const NewProdSell = async (data, cant, priceData, revendePrice) => {
        setError()
        if (productsSellList.length > 29) {
            swal("Cantidad Máxima de Registros", "Por cuestiones de formato no se pueden registrar más de 30 productos diferentes. Se recomienda que genere esta factura y agregar otra más de ser necesario.", "error");
        } else {
            data.cant_prod = parseInt(cant)
            data.key = (Math.random() * parseFloat(moment(new Date()).format("YYYYMMDDHHmmssms")))
            data.id_price = priceData.id
            data.vta_price = priceData.sell_price
            data.revendePrice = revendePrice
            setProductsSellList(productsSellList => [...productsSellList, data])

        }
    }

    const RemoveProduct = (key) => {
        const newList = productsSellList.filter(item => { return item.key !== key })
        setProductsSellList(newList)
    }

    const cancelarCompra = () => {
        setProductsSellList([])
        setTotalPrecio(0)
        setTotalRevende(0)
        setError()
    }

    useEffect(() => {
        console.log('totalRevende :>> ', totalRevende);
    }, [totalRevende])

    return (
        <ProdSellContext.Provider value={{
            NewProdSell,
            productsSellList,
            RemoveProduct,
            totalPrecio,
            error,
            cancelarCompra,
            setTotalPrecio,
            totalRevende,
            setTotalRevende
        }}>
            {children}
        </ProdSellContext.Provider>
    )
}
export default ProdSellProvider