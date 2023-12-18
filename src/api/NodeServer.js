require('dotenv').config()

let host = ""
let publicFiles = ""
const local = 1
if (process.env.NODE_ENV === "development") {
    if (local === 1) {
        host = "http://localhost:3002/api"
        publicFiles = "http://localhost:3002/static/"
    } else {
        host = "https://api-test.nekoadmin.com.ar/punto-aroma/api"
        publicFiles = "https://api-test.nekoadmin.com.ar/punto-aroma/static/"
    }
} else {
    host = "https://api-prod.nekoadmin.com.ar/punto-aroma/api"
    publicFiles = "https://api-prod.nekoadmin.com.ar/punto-aroma/static/"
}

const prodImages = publicFiles + "/images/products/"
const heroImages = publicFiles + "/images/heroSlider/"

const publicFolder = {
    prodImages,
    heroImages
}


const products = host + "/products"
const auth = host + "/auth"
const routes = host + "/routes"
const permissions = host + "/permissions"
const ptosVta = host + "/ptosVta"

const proveedores = host + "/proveedores"
const clientes = host + "/clientes"
const revendedores = host + "/revendedores"
const transportistas = host + "/transportistas"
const usuarios = host + "/user"
const stock = host + "/stock"
const invoices = host + "/invoices"
const heroSlider = host + "/heroSlider"

const productsDir = {
    products,
    sub: {
        details: products + "/details",
        variedades: products + "/varList",
        tipos: products + "/getTipos",
        marcas: products + "/getCat",
        proveedores: products + "/getGetSubCat",
        varCost: products + "/varCost",
        changePorc: products + "/changePorc",
        codBarra: products + "/codBarra",
        cost: products + "/cost",
        prices: products + "/prices",
        var: products + "/var",
        images: products + "/images",
        prodListPDF: products + "/prodListPDF",
        getTags: products + "/getTags"
    }
}
const authDir = {
    auth
}

const stockDir = {
    stock,
    sub: {
        ultMov: stock + "/ultMov",
        moverStock: stock + "/moverStock",
        ultStockList: stock + "/ultStockList",
        listaStock: stock + "/listaStock",
        stockProd: stock + "/stockProd",
        totalStock: stock + "/totalStock"
    }
}

const usuariosDir = {
    usuarios,
    sub: {
        details: usuarios + "/details",
        mydata: usuarios + "/mydata",
        sellers: usuarios + "/sellers",
        ctaCte: usuarios + "/ctaCte",
        payments: usuarios + "/payments",
        factDet: usuarios + "/factDet",
        clients: usuarios + "/clients"
    }
}

const permissionsDir = {
    permissions,
    sub: {
        list: "/list"
    }
}

const ptosVtaDir = {
    ptosVta,
    sub: {
        details: ptosVta + "/details",
        userPv: ptosVta + "/userPv"
    }
}

const proveedoresDir = {
    proveedores,
    sub: {
        details: proveedores + "/details"
    }
}

const clientesDir = {
    clientes,
    sub: {
        details: clientes + "/details",
        dataFiscal: clientes + "/dataFiscal",
        ctaCte: clientes + "/ctaCte",
        payments: clientes + "/payments",
        sellers: clientes + "/sellers",
        pricesType: clientes + "/pricesType",
        factDet: clientes + "/factDet",
        clientesDeudas: clientes + "/clientesDeudas",
        paymentsGral: clientes + "/paymentsGral"
    }
}

const revendedoresDir = {
    revendedores,
    sub: {
        details: clientes + "/details"
    }
}

const transportistasDir = {
    transportistas,
    sub: {
        details: clientes + "/details"
    }
}

const invoicesDir = {
    invoices,
    sub: {
        details: invoices + "/details",
        last: invoices + "/last",
        afipdata: invoices + "/afipData",
        cajaList: invoices + "/cajaList",
        cajaListPDF: invoices + "/cajaListPDF",
        factDataPDF: invoices + "/factDataPDF",
        notaCred: invoices + "/notaCred",
        paytype: invoices + "/paytype",
        dummy: invoices + "/dummy",
        timeout: invoices + "/timeout",
        detFact: invoices + "/detFact",
        notaCredPart: invoices + "/notaCredPart"
    }
}

const routesDir = {
    routes,
    sub: {
        dashboard: routes + "/dashboard",
        changePass: routes + "/changePass",
        clientes: routes + "/clientes",
        productos: routes + "/productos",
        proveedores: routes + "/proveedores",
        ptosVta: routes + "/ptosVta",
        revendedores: routes + "/revendedores",
        stock: routes + "/stock",
        transportistas: routes + "/transportistas",
        userAdmin: routes + "/userAdmin"
    }
}

const heroSliderDir = {
    heroSlider,
    sub: {
        details: heroSlider + "/details",
        enabled: heroSlider + "/enabled",
    }

}

const UrlNodeServer = {
    publicFolder,
    authDir,
    routesDir,
    permissionsDir,
    ptosVtaDir,
    productsDir,
    proveedoresDir,
    clientesDir,
    revendedoresDir,
    transportistasDir,
    usuariosDir,
    stockDir,
    invoicesDir,
    heroSliderDir
}

export default UrlNodeServer