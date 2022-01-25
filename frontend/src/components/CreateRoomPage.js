import React,{Component} from "react";
import { render } from "react-dom";
import Button from "@material-ui/core/Button"
import {withRouter} from './withRouter';

import { 
    Grid,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    Link,
    Radio,
    RadioGroup,
    FormControlLabel 
} from "@material-ui/core";
import {useNavigate, useParams } from "react-router-dom";



class CreateRoomPage extends Component {
    default_votes = 2;
    
    constructor(props){
        super(props);
        this.state ={
            guestCanPause:true,
            votesToSkip: this.defaultVotes,
        }
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this)
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this)
        this.handleVotesChanged = this.handleVotesChanged.bind(this)
    }
     handleVotesChanged(e){
         this.setState({
             votesToSkip: e.target.value,
         })
     }
    handleGuestCanPauseChange(e){
        this.setState({
            guestCanPause: e.target.value === "true"? true:false,
        })
    }

    handleRoomButtonPressed(){
        const requestOptions = {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        }
        fetch('/api/create-room',requestOptions)
        .then((response)=>response.json())
        .then((data)=> this.props.navigate("/room/" + data.code))
    }

    render(){
        return <Grid container spacing={1} align='center'>
            <Grid item xs={12}  >
                <Typography component="h4" variant="h4">
                    Create a Room 
                </Typography>
            </Grid>
            <Grid item xs={12} >
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest control of Playback State 
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue="true" onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary"/>}
                            label = "Play/Pause"
                            labelPlacement="bottom"
                        /> 
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary"/>}
                            label = "No Control"
                            labelPlacement="bottom"
                        /> 
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} >
                <FormControl>
                    <TextField 
                        required={true} 
                        type="number" 
                        defaultValue={this.defaultValue}
                        onChange={this.handleVotesChanged}
                        inputProps={{
                            min:1,
                            style:{textAlign:'center'}
                        }}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes Required To Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} >
                <Button color="primary"  variant="contained" onClick={this.handleRoomButtonPressed}>
                    Create A Room 
                </Button>
            </Grid>
            <Grid item xs={12} >
                <Button color="secondary" style={{color:'white'}} variant="contained" href='/' component={Link}>
                   Back
                </Button>
            </Grid>
        </Grid>;
  
    }
}

export default withRouter(CreateRoomPage);