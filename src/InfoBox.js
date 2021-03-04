import React from "react";
import './InfoBox.css';
import {Card, CardContent, Typography} from "@material-ui/core";

const InfoBox = ({title, cases, total}) => {

    return(
        <div>
            <Card className="info-box">
                <CardContent>
                    <Typography className="info-box-title" color="textSecondary">{title}</Typography>
                    <h2>{cases}</h2>
                    <Typography className="info-box-total" color="textSecondary">{total} total</Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default InfoBox;