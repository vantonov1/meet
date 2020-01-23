import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import LinearProgress from "@material-ui/core/LinearProgress";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function EquitiesList(props) {
    return (<InfiniteScroll className="equities-list"
                            dataLength={props.equities.length}
                            next={props.onFetch}
                            hasMore={props.hasMore}
                            loader={<LinearProgress/>}
                            height={props.height}
                            endMessage={<p/>}
    >
        {props.equities?.map(equity => (
            <Equity key={equity.id}
                    {...equity}
            />
        ))}
    </InfiniteScroll>)
}

function Equity(props) {
    return <ListItem className="equities-item">
        <ListItemText secondary={props.info}>
            <ListItemSecondaryAction>
                <div>{props.price}&#8381;</div>
            </ListItemSecondaryAction>
            {formatAddress(props)}
        </ListItemText>
    </ListItem>
}

function formatAddress(address) {
    return (<div>{address.street}&nbsp;{address.building}</div>)

}
