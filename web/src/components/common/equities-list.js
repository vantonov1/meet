import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import InfiniteScroll from 'react-infinite-scroll-component';
import AutoSizer from "react-virtualized-auto-sizer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import EquityRate from "./equity-rate";

const useStyles = makeStyles(theme => ({
    squareMeters: { verticalAlign: "super"},
    info: {whiteSpace: "nowrap", overflow: "hidden", textOverflow:"ellipsis"}
}));

export default function EquitiesList(props) {
    const {equities, selectedEquity, hasMore, onFetch, onClick} = props;
    return (
        <AutoSizer>
            {({height, width}) => (
                <InfiniteScroll style={{width: width}}
                                dataLength={equities.length}
                                next={onFetch}
                                hasMore={hasMore}
                                loader={<LinearProgress/>}
                                height={height}
                                endMessage={<p/>}
                >
                    {equities?.map((equity, index) => (
                        <Equity key={equity.id} selected={equity.id === selectedEquity?.id}
                                {...equity}
                                onClick={() => {
                                    onClick(equity)
                                }}
                        />
                    ))}
                </InfiniteScroll>
            )}
        </AutoSizer>
    )
}

export function Equity(props) {
    const {address, selected, onClick, price, square, rooms, info, comments} = props;
    const classes = useStyles();
    const subway = address.subway;
    const district = address.district;
    return <ListItem button divider selected={selected} onClick={onClick}>
        <ListItemText>
            <Box width={1}><b>{price}&#8381;</b>&nbsp;{address.street}&nbsp;{address.building}</Box>
            <Box width={1} className="MuiTypography-colorTextSecondary MuiTypography-body2">
                {subway && <span><span
                    style={{color: '#' + subway.color}}>&#9632;</span><span>&nbsp;{subway.name}&nbsp;</span></span>}
                {!subway && district && <span>{district.name}&nbsp;р-н</span>}
                <span>&nbsp;{square}м<span className={classes.squareMeters}>2</span>
                    {rooms && <span>&nbsp;{rooms}кк</span>}</span>
                <Box width="100%" className={classes.info}>{info}</Box>
            </Box>
        </ListItemText>
        <EquityRate comments={comments}/>
    </ListItem>
}

