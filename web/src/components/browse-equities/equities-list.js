import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import InfiniteScroll from 'react-infinite-scroll-component';

function onFetch(props) {
    props.onFetch()
}

export default function EquitiesList(props) {
    return (<div id="scrollableDiv" className="equities-list" style={{ height: "100%", overflow: "auto" }}>
        <InfiniteScroll
            dataLength={props.length}
            next={() => onFetch(props)}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            // scrollableTarget="scrollableDiv"
            height={props.height}
            endMessage={
                <p style={{textAlign: 'center'}}>
                    <b>Yay! You have seen it all</b>
                </p>
            }
        >
            {props.equities?.map(equity => (
                <Equity key={equity.id}
                        {...equity}
                />
            ))}
        </InfiniteScroll>
    </div>)
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

function formatAddress(props) {
    return (<div>{props.street}&nbsp;{props.building}</div>)

}
