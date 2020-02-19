import {Rating} from "@material-ui/lab";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import React, {useState} from "react";
import ShowInfo from "./showInfo";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Star from "@material-ui/icons/Star";

const useStyles = makeStyles((theme) => ({
    rating: {cursor: 'pointer', top: theme.spacing(3)}
}));

export default function EquityRate(props) {
    const {comments} = props;
    const [showComments, setShowComments] = useState(false);
    const classes = useStyles();

    if (comments)
        return <>
            <ListItemSecondaryAction onClick={() => setShowComments(true)} className={classes.rating}>
                <Rating readOnly value={avg(comments)} precision={0.5} icon={<Star fontSize="small" />}/>
            </ListItemSecondaryAction>
            <ShowInfo open={showComments} onOk={() => setShowComments(false)}>
                {comments.map((c, i) => <p key={i}>{c.text}</p>)}
            </ShowInfo>
        </>;
    else
        return <></>
}

const avg = comments => comments.map(c => c.rate).reduce((a, b) => a + b, 0) / comments.length;
