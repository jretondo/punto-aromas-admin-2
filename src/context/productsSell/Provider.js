import UrlNodeServer from 'api/NodeServer';
import axios from 'axios';
import { useState } from 'react';
import ProdSellContext from './index';
import React from 'react';
import moment from 'moment';

const ProdSellProvider = ({ children }) => {
    const [productsSellList, setProductsSellList] = useState([])
    const [totalPrecio, setTotalPrecio] = useState(0)
    const [error, setError] = useState()

    const NewProdSell = async (text, cant) => {
        setError()
        await axios.get(UrlNodeServer.productsDir.products + `/1?query=${text}&cantPerPage=1`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(async res => {
                const respuesta = res.data
                const status = respuesta.status
                if (status === 200) {
                    const data = respuesta.body.data[0]
                    data.cant_prod = cant
                    data.key = (Math.random() * parseFloat(moment(new Date()).format("YYYYMMDDHHmmssms")))
                    setProductsSellList(productsSellList => [...productsSellList, data])
                }
            }).catch((err) => { setError(err) })
    }

    const RemoveProduct = (key) => {
        const newList = productsSellList.filter(item => { return item.key !== key })
        setProductsSellList(newList)
    }

    const cancelarCompra = () => {
        setProductsSellList([])
        setTotalPrecio(0)
        setError()
    }

    return (
        <ProdSellContext.Provider value={{
            NewProdSell,
            productsSellList,
            RemoveProduct,
            totalPrecio,
            error,
            cancelarCompra,
            setTotalPrecio
        }}>
            {children}
        </ProdSellContext.Provider>
    )
}
export default ProdSellProvider