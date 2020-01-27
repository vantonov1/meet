import React from "react";
import {Box} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const selectedFiles = [];

export function getSelectedFiles() {
    return selectedFiles;
}

export function clearSelectedFiles() {
    while (selectedFiles.length > 0) selectedFiles.pop()
}

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(5),
        },
    },
    input: {
        display: 'none',
    },
    button: {
        margin: theme.spacing(2),
    }
}));

export default function PhotoUpload(props) {
    const classes = useStyles();
    const {onFileUploaded} = props;

    return (
        <Box>
            <input
                accept="image/jpeg"
                id="contained-button-file"
                className={classes.input}
                multiple
                type="file"
                onChange={(e) => {
                    for (let i = 0; i < e.target.files.length; i++) {
                        const file = e.target.files[i];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            selectedFiles.push({file: file, url:reader.result});
                            onFileUploaded(file.name);
                        };
                        reader.readAsDataURL(file);
                    }
                }}
            />
            <label htmlFor="contained-button-file">
                <Button component="span" className={classes.button}>
                    Добавить фото
                </Button>
            </label>
        </Box>
    )
}
