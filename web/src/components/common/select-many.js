import React, {Component} from "react";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Checkbox, Input} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";

export default class SelectMany extends Component {
    constructor(props) {
        super(props);
        this.state ={filter: '', selected: props.selected};
    }

    handleChange = (id, checked) => {
        let selected = this.state.selected;
        if (checked) {
            if (!selected.includes(id)) {
                this.setState({selected: [...selected, id]});
            }
        } else if (selected.includes(id)) {
            let index = selected.indexOf(id);
            this.setState({selected: [...selected.slice(0, index), ...selected.slice(index + 1)]});
        }
    };


    render() {
        const filterExpr = new RegExp("^" + this.state.filter,"i");
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                open={true}
            >
                <DialogContent>
                    <Input autoFocus={true} style={{width: "100%"}}
                           onChange={e => this.setState({filter: e.target.value})}/>
                    {this.props.values.filter(d => this.state.filter === '' || d.name.match(filterExpr)).map(d =>
                        <Box key={d.id}>
                            <FormControlLabel
                                control={<Checkbox checked={this.state.selected.includes(d.id)}
                                                   onChange={e => this.handleChange(d.id, e.target.checked)}/>}
                                label={d.name}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onCancel}>
                        Отменить
                    </Button>
                    <Button onClick={() => {
                        this.setState({selected: []})
                    }}>
                        Сбросить
                    </Button>
                    <Button onClick={() => {
                        this.props.onOk(this.state.selected);
                    }} color="primary">
                        Применить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}