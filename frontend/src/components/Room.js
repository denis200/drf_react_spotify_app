import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {Grid, Button, Typography} from "@material-ui/core"
import CreateRoomPage from "./CreateRoomPage"
import {useNavigate} from "react-router-dom"
import MusicPlayer from "./MusicPlayer"
export default function Room(props) {
	const navigate = useNavigate()
	const initialState = {
		votesToSKip: 2,
		guestCanPause: false,
		isHost: false,
		showSettings: false,
		spotifyAuthenticated: false,
	}
	const [song, setSong] = useState({})
	const [roomData, setRoomData] = useState(initialState)
	const [showSettings, updateShowSettings] = useState()
	const {roomCode} = useParams()
	const [first, setFirst] = useState(true)
	useEffect(() => {
		getRoomDetails()
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			getCurrentSong()
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	function getRoomDetails() {
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
					votesToSkip: data.votes_to_skip,
					guestCanPause: data.guest_can_pause,
					isHost: data.is_host,
				})
				if (roomData.isHost) authenticateSpotify()
			})
	}

	function authenticateSpotify() {
		fetch("/spotify/is-authenticated")
			.then(response => response.json())
			.then(data => {
				setRoomData({
					...roomData,
					spotifyAuthenticated: data.status,
				})
				console.log(data.status)
				if (!data.status) {
					fetch("/spotify/get-auth-url")
						.then(response => response.json())
						.then(data => {
							window.location.replace(data.url)
						})
				}
			})
	}

	function getCurrentSong() {
		fetch("/spotify/current-song")
			.then(response => {
				if (!response.ok) {
					return {}
				} else {
					return response.json()
				}
			})
			.then(data => {
				setSong(data), console.log("data is", data)
			})
	}

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
	const handleShowSettings = value => {
		updateShowSettings(value)
	}
	function RenderSettings() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={roomData.votesToSkip}
						guestCanPause={roomData.guestCanPause}
						roomCode={roomCode}
						updateCallback={getRoomDetails}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						variant="contained"
						color="secondary"
						onClick={() => {
							handleShowSettings(false)
							getRoomDetails()
							getCurrentSong()
						}}
					>
						Close
					</Button>
				</Grid>
			</Grid>
		)
	}
	function renderSettingsButton() {
		return (
			<Grid item xs={12} align="center">
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						handleShowSettings(true)
					}}
				>
					Settings
				</Button>
			</Grid>
		)
	}
	return (
		<div>
			{showSettings ? (
				<RenderSettings />
			) : (
				<Grid container spacing={2}>
					<Grid item xs={12} align="center">
						<Typography variant="h4" component="h4">
							Code: {roomCode}
						</Typography>
					</Grid>
					<MusicPlayer {...song} />
					{roomData.isHost ? renderSettingsButton() : null}
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
			)}
		</div>
	)
}

/*	<div>
			<h3>{roomCode}</h3>
			<p>Votes: {roomData.votesToSKip}</p>
			<p>Guest: {roomData.guestCanPause.toString()}</p>
			<p>Host: {roomData.isHost.toString()}</p>
		</div>*/
