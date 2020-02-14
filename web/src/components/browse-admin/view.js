import React from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import BrowseAdministrators from "../browse-admins/view";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BrowseAgents from "../browse-agents/view";

const TABS = [{url: 'agents', label: 'Агенты'}, {url: 'administrators', label: 'Администраторы'}];

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(1) + theme.mixins.toolbar.minHeight
    },
}));


export default function BrowseAdmin(props) {
    const {tab} = props;
    const classes = useStyles();

    return <>
        <Tabs value={parseInt(tab)}
              className={classes.root}
              onChange={(e, v) => window.location.pathname = '/admin/' + TABS[v].url}
        >
            {TABS.map(t => <Tab key={t.url} label={t.label}/>)}
        </Tabs>
        {tab === '0' && <BrowseAgents/>}
        {tab === '1' && <BrowseAdministrators/>}
    </>
};