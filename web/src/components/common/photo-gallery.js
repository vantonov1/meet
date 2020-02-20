import {Box, makeStyles} from "@material-ui/core";
import React from "react";
import Modal from "@material-ui/core/Modal";
import Fab from "@material-ui/core/Fab";
import LeftArrow from "@material-ui/icons/ChevronLeft";
import RightArrow from "@material-ui/icons/ChevronRight";

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
        overflowX: "auto",
        overflowY: "hidden"
    },
    image: {height: GALLERY_HEIGHT - IMAGE_PADDING * 2, padding: IMAGE_PADDING},
    popoverImg: {maxHeight: "100%", maxWidth: "100%", objectFit: "scale-down"},
    popoverContainer: {textAlign: "center", height: "100%"},
    popoverButton: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50 %)"
    }
}));

export default function PhotoGallery(props) {
    const [showPopover, setShowPopover] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);
    const classes = useStyles();

    const handleClick = (e, i) => {
        setShowPopover(true);
        setCurrentImage(i);
    };

    function gallery(props) {
        return <div className={classes.gridList}>
            {props.images.map((f, i) => <img key={i} src={f} className={classes.image}
                                             onClick={(e) => handleClick(e, i)}
                                             alt={"Здесь было фото"}/>)}
        </div>;
    }

    function popover(props) {
        return <Modal open={showPopover}
                      className={classes.popoverContainer}
                      disableAutoFocus
                      onEscapeKeyDown={() => setShowPopover(false)}
                      onBackdropClick={() => setShowPopover(false)}>
            <Box width={1} height={1} style={{display: 'flex', justifyContent: 'center'}}>
                <img src={props.images[currentImage]}
                     className={classes.popoverImg} alt="Фото"
                     onClick={() => setShowPopover(false)}
                />
                <Fab style={{left: 40}} className={classes.popoverButton} onClick={() => {
                    if (currentImage > 0) setCurrentImage(currentImage - 1);
                    else setCurrentImage(props.images.length - 1)
                }}>
                    <LeftArrow/>
                </Fab>
                <Fab style={{right: 40}} className={classes.popoverButton} onClick={() => {
                    if (currentImage < props.images.length - 1) setCurrentImage(currentImage + 1);
                    else setCurrentImage(0)
                }}>
                    <RightArrow/>
                </Fab>
            </Box>
        </Modal>;
    }

    return <div className={classes.root}>
        {props.images && gallery(props)}
        {popover(props)}
    </div>
}