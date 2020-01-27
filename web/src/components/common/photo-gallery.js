import {makeStyles} from "@material-ui/core";
import React from "react";

const GALLERY_HEIGHT = 150;
const IMAGE_PADDING = 2;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        height: GALLERY_HEIGHT,
        display: "flex",
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
        listStyle: "none",
        overflowX: "scroll",
        overflowY: "hidden"
    },
    image: {height: GALLERY_HEIGHT - IMAGE_PADDING * 2, padding: IMAGE_PADDING}
}));

export default function PhotoGallery(props) {
    const classes = useStyles();
    return <div className={classes.root}>
        {props.images && <div className={classes.gridList}>
            {props.images.map(f => <img key={f} src={f} className={classes.image} alt={"Здесь было фото"}/>)}
        </div>}
    </div>
}