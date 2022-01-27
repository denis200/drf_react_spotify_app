import React, {Component, useState, useEffect} from "react"
import RoomJoinPage from "./RoomJoinPage"
import CreateRoomPage from "./CreateRoomPage"
import Room from "./Room"
import {Grid, Button, ButtonGroup, Typography} from "@material-ui/core"
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Routes,
	Link,
	Redirect,
	Navigate,
} from "react-router-dom"

export default function HomePage(props) {
	const [roomCode, setRoomCode] = useState()
	useEffect(() => {
		fetch("/api/user-in-room")
			.then(response => response.json())
			.then(data => {
				setRoomCode(data.code)
			})
	}, [roomCode])

	function RenderHomePage() {
		return roomCode ? (
			<Navigate to={`room/${roomCode}`} />
		) : (
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h3" component="h3">
						{roomCode}
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<ButtonGroup
						disableElevation
						variant="contained"
						color="primary"
					>
						<Button color="primary" to="/join" component={Link}>
							Join a room
						</Button>
						<Button color="secondary" to="/create" component={Link}>
							Create a Room
						</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
		)
	}
	function RenderRoom() {
		return <Room leaveRoomCallback={clearRoomCode} />
	}
	const clearRoomCode = () => {
		setRoomCode(null)
	}
	return (
		<Router>
			<Routes>
				<Route path="/" element={<RenderHomePage />}></Route>
				<Route path="/join" element={<RoomJoinPage />}></Route>
				<Route path="/create" element={<CreateRoomPage />}></Route>
				<Route path="/room/:roomCode" element={<RenderRoom />} />{" "}
			</Routes>
		</Router>
	)
}
