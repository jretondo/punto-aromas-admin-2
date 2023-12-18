import React from 'react';
import { Button } from 'reactstrap';

const ButtonOpenCollapse = ({
    action,
    tittle,
    active,
    thin
}) => {

    return (
        <Button
            color={active ? "success" : "primary"}
            style={thin ? { width: "100%", paddingInline: "10px" } : { width: "100%", height: "50px", paddingInline: "60px" }}
            onClick={() => action()}
            disabled={active}
        >
            {tittle}
        </Button>
    )
}

export default ButtonOpenCollapse