import React, {Component} from "react"
import {render} from "react-dom"
import Button from "@material-ui/core/Button"
import {withRouter} from "./withRouter"

import {
	Grid,
	Typography,
	TextField,
	FormHelperText,
	FormControl,
	Link,
	Radio,
	RadioGroup,
	Collapse,
	FormControlLabel,
} from "@material-ui/core"
import {useNavigate, useParams} from "react-router-dom"
//import {Collapse} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

class CreateRoomPage extends Component {
	static defaultProps = {
		votesToSkip: 2,
		guestCanPause: true,
		update: false,
		roomCode: null,

		updateCallback: () => {},
	}

	constructor(props) {
		super(props)

		this.state = {
			guestCanPause: this.props.guestCanPause,
			votesToSkip: this.props.votesToSkip,
			errorMsg: "",
			successMsg: "",
		}
		this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this)
		this.handleGuestCanPauseChange =
			this.handleGuestCanPauseChange.bind(this)
		this.handleVotesChanged = this.handleVotesChanged.bind(this)
		this.handleUpdateButtonPressed =
			this.handleUpdateButtonPressed.bind(this)
	}
	handleVotesChanged(e) {
		this.setState({
			votesToSkip: e.target.value,
		})
	}
	handleGuestCanPauseChange(e) {
		this.setState({
			guestCanPause: e.target.value === "true" ? true : false,
		})
	}

	renderCreateButtons() {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Button
						color="primary"
						variant="contained"
						onClick={this.handleRoomButtonPressed}
					>
						Create A Room
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Button
						color="secondary"
						style={{color: "white"}}
						variant="contained"
						href="/"
						component={Link}
					>
						Back
					</Button>
				</Grid>
			</Grid>
		)
	}

	handleRoomButtonPressed() {
		const requestOptions = {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				votes_to_skip: this.state.votesToSkip,
				guest_can_pause: this.state.guestCanPause,
			}),
		}
		fetch("/api/create-room", requestOptions)
			.then(response => response.json())
			.then(data => this.props.navigate("/room/" + data.code))
	}

	handleUpdateButtonPressed() {
		const requestOptions = {
			method: "PATCH",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				votes_to_skip: this.state.votesToSkip,
				guest_can_pause: this.state.guestCanPause,
				code: this.props.roomCode,
			}),
		}
		fetch("/api/update-room", requestOptions).then(response => {
			if (response.ok) {
				this.setState({
					successMsg: "Room updated succesfully!",
				})
			} else {
				this.setState({
					errorMsg: "Error updating room!",
				})
			}
		})
	}

	renderUpdateButton() {
		return (
			<Grid item xs={12}>
				<Button
					color="primary"
					variant="contained"
					onClick={this.handleUpdateButtonPressed}
				>
					Update Room
				</Button>
			</Grid>
		)
	}

	render() {
		const title = this.props.update ? "Update Room" : "Create Room"
		return (
			<Grid container spacing={1} align="center">
				<Grid item xs={12}>
					<Collapse
						in={
							this.state.errorMsg != "" ||
							this.state.successMsg != ""
						}
					>
						{this.state.successMsg != "" ? (
							<Alert
								severity="success"
								onClose={() => {
									this.setState({successMsg: ""})
								}}
							>
								{this.state.successMsg}
							</Alert>
						) : (
							<Alert
								severity="error"
								onClose={() => {
									this.setState({errorMsg: ""})
								}}
							>
								{this.state.errorMsg}
							</Alert>
						)}
					</Collapse>
					<Typography component="h4" variant="h4">
						{title}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<FormControl component="fieldset">
						<FormHelperText>
							<div align="center">
								Guest control of Playback State
							</div>
						</FormHelperText>
						<RadioGroup
							row
							defaultValue={this.props.guestCanPause.toString()}
							onChange={this.handleGuestCanPauseChange}
						>
							<FormControlLabel
								value="true"
								control={<Radio color="primary" />}
								label="Play/Pause"
								labelPlacement="bottom"
							/>
							<FormControlLabel
								value="false"
								control={<Radio color="secondary" />}
								label="No Control"
								labelPlacement="bottom"
							/>
						</RadioGroup>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl>
						<TextField
							required={true}
							type="number"
							defaultValue={this.state.votesToSkip}
							onChange={this.handleVotesChanged}
							inputProps={{
								min: 1,
								style: {textAlign: "center"},
							}}
						/>
						<FormHelperText>
							<div align="center">
								Votes Required To Skip Song
							</div>
						</FormHelperText>
					</FormControl>
				</Grid>

				{this.props.update
					? this.renderUpdateButton()
					: this.renderCreateButtons()}
			</Grid>
		)
	}
}

export default withRouter(CreateRoomPage)
