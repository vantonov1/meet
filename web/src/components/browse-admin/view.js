import React, {useEffect} from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import BrowseAdministrators from "../browse-admins/view";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BrowseAgents from "../browse-agents/view";
import {Link} from "react-router-dom";

const TABS = [{url: 'agents', label: 'Агенты'}, {url: 'administrators', label: 'Администраторы'}];

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(1) + theme.mixins.toolbar.minHeight
    },
}));


export default function BrowseAdmin(props) {
    const {tab} = props;
    const classes = useStyles();

    useEffect(() => {document.title = 'Митилка - консоль администратора'});

    return <>
        <Tabs value={parseInt(tab)} className={classes.root}>
            {TABS.map(t => <Tab key={t.url} label={t.label} component={Link} to={t.url}/>)}
        </Tabs>
        {tab === '0' && <BrowseAgents/>}
        {tab === '1' && <BrowseAdministrators/>}
    </>
};