import React, {useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, DialogContent, Divider, List, MenuItem, TextField} from "@material-ui/core";
import {
    changeRequestEquity,
    completeRequest,
    deleteRequest,
    loadRequests,
    selectRequest,
    updateRequests
} from "./slice";
import {MergedRequestListItem} from "../common/list-items";
import Menu from "@material-ui/core/Menu";
import ConfirmAction from "../common/confirm-action";
import AddEquity from "../add-equity/view";
import {showAddEquity} from "../add-equity/slice";
import {showCreateMeeting} from "../create-meeting/slice";
import CreateMeeting from "../create-meeting/view";
import {isBefore} from "date-fns";
import parse from 'date-fns/parseISO'
import EnterValue from "../common/enter-value";
import BrowseList from "../common/browse-list";
import {onMessageReceived} from "../../api/FirebaseAPI";
import {Equity} from "../common/equities-list";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";

const compareDates = (a, b) => a.meeting ? b.meeting ? isBefore(parse(a.meeting), parse(b.meeting)) ? -1 : 1 : -1 : 1;

export default function BrowseAssignedRequests() {
    const {records, selectedRequest} = useSelector(state => state.browseAssignedRequests, shallowEqual);
    const {filter} = useSelector(state => state.browseEquities, shallowEqual);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmCompleted, setConfirmCompleted] = useState(false);
    const [changeEquity, setChangeEquity] = useState(false);
    const [contractNumber, setContractNumber] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        onMessageReceived(m => {
            dispatch(updateRequests())
        })
    });

    return <>
        <BrowseList slice="browseAssignedRequests" title='Заявки в работе' loader={loadRequests} topLevel={true}>
            {mergeRequests(records).sort(compareDates).map(r =>
                <MergedRequestListItem key={r.id} equity={r.about} buyer={r.buyer} seller={r.seller} meeting={r.meeting}
                                       selected={selectedRequest?.id === r.id}
                                       onClick={(e) => {
                                           setMenuAnchor(e.target);
                                           dispatch(selectRequest(r))
                                       }}/>)}
        </BrowseList>
        {selectedRequest && <Menu open={menuAnchor != null} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem disabled={selectedRequest?.about !== null} onClick={() => {
                dispatch(showAddEquity(true));
                setMenuAnchor(null)
            }}>Создать объект по заявке</MenuItem>
            <MenuItem disabled={!selectedRequest} onClick={() => {
                setConfirmDelete(true);
                setMenuAnchor(null)
            }}>Удалить заявку</MenuItem>
            <MenuItem disabled={selectedRequest?.about === null || selectedRequest?.buyer == null} onClick={() => {
                dispatch(showCreateMeeting(true));
                setMenuAnchor(null)
            }}>Назначить встречу</MenuItem>
            <MenuItem disabled={selectedRequest?.buyer == null} onClick={() => {
                setChangeEquity(true);
                setMenuAnchor(null)
            }}>Предложить другой объект</MenuItem>
            <Divider/>
            <MenuItem disabled={selectedRequest?.about === null || selectedRequest?.buyer == null} onClick={() => {
                setConfirmCompleted(true);
                setMenuAnchor(null)
            }}>Сделка завершена</MenuItem>
        </Menu>}
        {selectedRequest &&
        <ConfirmAction open={confirmDelete} text="Удалить заявку?" onCancel={() => setConfirmDelete(false)}
                       onOK={() => {
                           setConfirmDelete(false);
                           dispatch(deleteRequest(selectedRequest))
                       }}/>}
        {selectedRequest && <AddEquity type={filter.type} city={filter.city} fromRequest={selectedRequest}/>}
        {selectedRequest && <CreateMeeting fromRequest={selectedRequest}/>}
        {selectedRequest && <SelectEquity open={changeEquity}
                                          city={selectedRequest.about?.address.city}
                                          type={selectedRequest.about?.type}
                                          onCancel={() => setChangeEquity(false)}
                                          onSelect={(e) => {
                                              dispatch(changeRequestEquity(selectedRequest, e));
                                              setChangeEquity(false);
                                          }}
        />}
        {selectedRequest && <EnterValue open={confirmCompleted}
                                        onCancel={() => setConfirmCompleted(false)}
                                        onOk={() => {
                                            setConfirmCompleted(false);
                                            dispatch(completeRequest(selectedRequest, contractNumber))
                                        }}
        >
            <TextField autoFocus value={contractNumber} onChange={e => setContractNumber(e.target.value)}
                       label="Номер договора"/>
        </EnterValue>}
    </>

}

function SelectEquity(props) {
    const {records} = useSelector(state => state.browseAssignedRequests, shallowEqual);
    const {open, city, type, onSelect, onCancel} = props;
    const suitable = mergeRequests(records).filter(r => r.about?.type === type && r.about?.address.city === city && r.buyer === undefined);
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            width: 400,
            height: "100%",
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1)
        },
    }))();


    return <Dialog open={open}>
        <DialogContent>
            <List className={classes.root}>
                {suitable.map(r =>
                    <Equity key={r.id} selected={false}
                            {...r.about}
                            onClick={() => onSelect(r.about)}
                    />
                )}
            </List>
            <DialogActions>
                <Button onClick={() => onCancel()}>
                    Отменить
                </Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}

function mergeRequests(requests) {
    const counterReq = requests.filter(r => r.type === 'BUY');
    return requests.filter(r => r.type === 'SELL').map((r) => {
        const buy = counterReq.find(c => c.about?.id === r.about?.id);
        return {
            id: r.id,
            buyId: buy?.id,
            about: r.about,
            assignedTo: r.assignedTo,
            seller: r.issuedBy,
            buyer: buy?.issuedBy,
            meeting: buy?.meetingScheduled
        }
    })
}