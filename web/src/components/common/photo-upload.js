import React from "react";
import {Box} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

let selectedFiles = [];
export function getSelectedFiles() {
    return selectedFiles;
}
export function clearSelectedFiles() {
    selectedFiles = []
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
}));

export default function PhotoUpload(props) {
    const classes = useStyles();
    const {files, onFileUploaded} = props;

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
                            selectedFiles.push(file);
                            onFileUploaded({
                                file: file.name,
                                url: reader.result
                            });
                        };
                        reader.readAsDataURL(file);
                    }
                }}
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                    Добавить фото
                </Button>
            </label>
            <div className="imgPreview">
                {files.map(f => <img key={f.name} style={{maxWidth: 100, maxHeight: 100}} src={f.url} alt="фото"/>)}
            </div>
        </Box>
    )
}
