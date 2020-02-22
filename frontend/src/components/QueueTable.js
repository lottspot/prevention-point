import React, { useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import Paper from "@material-ui/core/Paper"
import EditIcon from "@material-ui/icons/Edit"
import CheckIcon from "@material-ui/icons/Check"
import IconButton from "@material-ui/core/IconButton"
import MaterialTable from "material-table"
import moment from "moment"
import QueueTableDropdown from "./QueueTableDropdown"
import { QueueStoreContext } from "../stores/QueueStore"
import { ParticipantStoreContext } from "../stores/ParticipantStore"
import NotesDialog from "./NotesDialog"
import { useHistory } from "react-router-dom"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
}))

const QueueTable = observer(queueData => {
  const queueStore = useContext(QueueStoreContext)
  const participantStore = useContext(ParticipantStoreContext)
  const classes = useStyles()
  const [visibleDialog, setVisibleDialog] = useState(false)
  const [notesVisit, setNotesVisit] = useState(1)
  const history = useHistory()

  const handleNotesClick = visitId => {
    setNotesVisit(visitId)
    toggleVisibleDialog()
  }

  const toggleVisibleDialog = () => {
    setVisibleDialog(!visibleDialog)
  }

  const seenHandler = id => {
    queueStore.updateStatus(queueData.queueData, id.id, "SEEN")
  }

  const statusOptions = [
    { value: "ARRIVED", name: "Waiting" },
    { value: "STEPPED_OUT", name: "Stepped Out" },
    { value: "LEFT", name: "Left" },
  ]

  const urgencyOptions = [
    { value: "_1", name: 1 },
    { value: "_2", name: 2 },
    { value: "_3", name: 3 },
    { value: "_4", name: 4 },
    { value: "_5", name: 5 },
  ]

  const NotesButton = visitId => {
    return (
      <IconButton onClick={() => handleNotesClick(visitId)}>
        <EditIcon />
      </IconButton>
    )
  }

  const SeenButton = i => {
    return (
      <IconButton onClick={() => seenHandler(i)}>
        <CheckIcon />
      </IconButton>
    )
  }

  return (
    <Paper className={classes.root}>
      <MaterialTable
        title={queueStore.queueStats[queueData.queueData].name}
        className={classes.table}
        localization={{ body: { emptyDataSourceMessage: "Queue is empty" } }}
        options={{ search: false, sorting: true }}
        data={queueStore.queues[queueData.queueData].map(x => ({
          urgency: x.urgency,
          first: x.participant.first_name,
          last: x.participant.last_name,
          uid: x.participant.pp_id,
          last_four_ssn: x.participant.last_four_ssn,
          date_of_birth: x.participant.date_of_birth,
          start_date: x.participant.start_date,
          race: x.participant.race,
          gender: x.participant.gender,
          has_insurance: x.participant.is_insured,
          insurance_type: "",
          insurer: x.participant.insurer,
          timeElapsed: moment(x.status.created_at).format("LT"),
          status: x.status.event_type,
          program: x.program.name,
          service: x.service.name,
          seen: false,
          notes: false,
          visit_id: x.id,
          id: x.participant.id,
        }))}
        actions={[
          {
            icon: "assignmentIndIcon",
            tooltip: "Edit Participant",
            onClick: (event, rowData) => {
              participantStore.setParticipant({
                id: rowData.id,
                first_name: rowData.first,
                last_name: rowData.last,
                last_four_ssn: rowData.last_four_ssn,
                date_of_birth: rowData.date_of_birth,
                start_date: rowData.start_date,
                pp_id: rowData.uid,
                race: rowData.race,
                gender: rowData.gender,
                has_insurance: rowData.is_insured,
                insurance_type: rowData.insurance_type,
                insurer: rowData.insurer,
              })
              participantStore.setVisit({
                id: rowData.visit_id,
                participant: rowData.id,
                program: rowData.program,
                service: rowData.service,
                notes: "",
                urgency: rowData.urgency,
              })
              history.push("/participantInfo", rowData)
            },
          },
        ]}
        columns={[
          {
            title: "Urgency",
            //eslint-disable-next-line
            render: ({ id, urgency }) => (
              <QueueTableDropdown
                id={id}
                initialValue={urgency}
                items={urgencyOptions}
                queueData={queueData.queueData}
                column="urgency"
              />
            ),
            customSort: (a, b) => +a.urgency[1] - +b.urgency[1],
          },
          { title: "First", field: "first" },
          { title: "Last", field: "last" },
          { title: "UID", field: "uid" },
          {
            title: "Time",
            field: "timeElapsed",
            customSort: (a, b) =>
              new Date("1970/01/01 " + a.timeElapsed) -
              new Date("1970/01/01 " + b.timeElapsed),
          },
          {
            title: "Status",
            //eslint-disable-next-line
            render: ({ id, status }) => (
              <QueueTableDropdown
                id={id}
                initialValue={status}
                items={statusOptions}
                queueData={queueData.queueData}
                column="status"
              />
            ),
          },
          { title: "Service", field: "service" },
          {
            title: "Seen",
            //eslint-disable-next-line
            render: ({ id }) => <SeenButton id={id} />,
          },
          {
            title: "Notes",
            //eslint-disable-next-line
            render: ({ id }) => <NotesButton id={id} />,
          },
        ]}
      />
      <NotesDialog
        visibleDialog={visibleDialog}
        toggleVisibleDialog={toggleVisibleDialog}
        queueData={queueData.queueData}
        id={notesVisit.id}
      />
    </Paper>
  )
})

QueueTable.propTypes = {
  queueData: PropTypes.number,
}

export default QueueTable
