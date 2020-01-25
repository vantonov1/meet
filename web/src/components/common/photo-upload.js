import React from "react";
import {Box} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const selectedFiles = [];
export function getSelectedFiles() {
    return selectedFiles;
}
export function clearSelectedFiles() {
    while(selectedFiles.length > 0) selectedFiles.pop()
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
                <Button variant="contained" component="span">
                    Добавить фото
                </Button>
            </label>
            <div className="image-preview" style={{overflowX: "auto"}}>
                {files.map(f => <img key={f.name} style={{maxWidth: 150, maxHeight: 150}} src={f.url} alt="Здесь было фото"/>)}
            </div>
        </Box>
    )
}
