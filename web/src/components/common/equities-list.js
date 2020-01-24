import React from "react";
import ListItem from "@material-ui/core/ListItem";
import LinearProgress from "@material-ui/core/LinearProgress";
import InfiniteScroll from 'react-infinite-scroll-component';
import {Box} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";

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
    const subway = props.address.subway;
    const district = props.address.district;
    return <ListItem className="equities-item">
        <ListItemText>
            <Box width={1}><b>{props.price}&#8381;</b>&nbsp;{props.address.street}&nbsp;{props.address.building}</Box>
            <Box width={1} className="MuiTypography-colorTextSecondary MuiTypography-body2">
                {subway && <span><span style={{color: '#' + subway.color}}>&#9632;</span><span>&nbsp;{subway.name}&nbsp;</span></span>}
                {!subway && district && <span>{district.name}&nbsp;р-н</span>}
                <Box width={1}>{props.info}</Box>
            </Box>
        </ListItemText>
    </ListItem>
}