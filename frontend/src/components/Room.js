import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {Grid, Button, Typography} from "@material-ui/core"
import {useNavigate} from "react-router-dom"
export default function Room(props) {
	const navigate = useNavigate()
	const initialState = {
		votesToSKip: 2,
		guestCanPause: false,
		isHost: false,
	}
	const [roomData, setRoomData] = useState(initialState)
	const {roomCode} = useParams()
	useEffect(() => {
		fetch("/api/get-room" + "?code=" + roomCode)
			.then(res => {
				if (!res.ok) {
					props.leaveRoomCallback()
					navigate("/")
				}
				return res.json()
			})
			.then(data => {
				setRoomData({
					...roomData,
					votesToSKip: data.votes_to_skip,
					guestCanPause: data.guest_can_pause,
					isHost: data.is_host,
				})
			})
	}, [roomCode, setRoomData])

	function leaveButtonPressed() {
		const requestOptions = {
			method: "POST",
			headers: {"Content-Type": "application/json"},
		}
		fetch("/api/leave-room", requestOptions).then(_response => {
			props.leaveRoomCallback()
			navigate("/")
		})
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} align="center">
				<Typography variant="h4" component="h4">
					Code: {roomCode}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography variant="h6" component="h6">
					Votes: {roomData.votesToSKip}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography variant="h6" component="h6">
					Guest:{roomData.guestCanPause.toString()}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography variant="h6" component="h6">
					Host: {roomData.isHost.toString()}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<Button
					variant="contained"
					color="secondary"
					onClick={leaveButtonPressed}
				>
					Leave Room
				</Button>
			</Grid>
		</Grid>
	)
}

/*	<div>
			<h3>{roomCode}</h3>
			<p>Votes: {roomData.votesToSKip}</p>
			<p>Guest: {roomData.guestCanPause.toString()}</p>
			<p>Host: {roomData.isHost.toString()}</p>
		</div>*/
