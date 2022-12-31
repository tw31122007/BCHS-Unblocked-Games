package org.usfirst.frc.team871.robot;

import org.usfirst.frc.team871.robot.XBoxController.Axes;

import edu.wpi.first.wpilibj.CANTalon;
import edu.wpi.first.wpilibj.DigitalInput;
import edu.wpi.first.wpilibj.DoubleSolenoid;
import edu.wpi.first.wpilibj.DoubleSolenoid.Value;
import edu.wpi.first.wpilibj.Encoder;
import edu.wpi.first.wpilibj.SpeedController;
import edu.wpi.first.wpilibj.interfaces.Potentiometer;
import edu.wpi.first.wpilibj.networktables.NetworkTable;

public class Lifter {
    
    //TODO: Check if there's other motors (winch)
	SpeedController pullUpMotor, beaterBarPos; 
	
    CANTalon telescopingMotor;
	DoubleSolenoid liftPiston, lockSolenoid;
    
    //TODO: Check if we have these
	DigitalInput grabSense, armDeployedSense;
    
	Potentiometer telescopePotentiometer;
	XBoxController xbox;
	final NetworkTable dashboard = NetworkTable.getTable("SmartDashboard");
	
	public LifterStates currState = LifterStates.TRANSPORT;
	boolean autoEnabled = true;
	
	public Lifter(CANTalon telescopingMotor, 
                    DoubleSolenoid raisor, 
                    DigitalInput grabSense, 
                    DigitalInput armUpSense, 
                    DoubleSolenoid lockSolenoid, 
                    Potentiometer telescopePotentiometer, 
                    SpeedController pullUpMotor, 
                    XBoxController xbox, 
                    SpeedController beaterBarPos){
		this.telescopingMotor = telescopingMotor;
		this.liftPiston = raisor;
		this.lockSolenoid = lockSolenoid;
		this.grabSense = grabSense;
		this.armDeployedSense = armUpSense;
		this.pullUpMotor = pullUpMotor;
		this.telescopePotentiometer = telescopePotentiometer;
		this.xbox = xbox;
		this.beaterBarPos = beaterBarPos;
		
		if(this.armDeployedSense.get()){
			setCurrState(LifterStates.STARTUP_RESET);
		}
		
	}
	/**
	 * This method is called in doAuto() to update the state machine
	 */
	public void update(){
		dashboard.putNumber("telescopeEncoder", telescopingMotor.getPosition());
		
		switch(currState){
		case TRANSPORT:
			liftPiston.set(Value.kReverse);
			
			if(xbox.justPressed(Vars.LIFTER_ADVANCE_BUTTON)){
				currState = LifterStates.DEPLOY_ARM;
			}
			
			break;
			
		case DEPLOY_ARM:
			if(xbox.justPressed(Vars.LIFTER_ABORT_BUTTON)){
				currState = LifterStates.TRANSPORT;
			}
			
            //TODO: Check if it's active low
			if(xbox.justPressed(Vars.LIFTER_ADVANCE_BUTTON) && armDeployedSense.get()){ 
				currState = LifterStates.EXTEND; 
			}else{
				liftPiston.set(Value.kForward);
			}
			break;
			
		case EXTEND:
			if(xbox.justPressed(Vars.LIFTER_ABORT_BUTTON)){
				currState = LifterStates.TRANSPORT;
			}
	
            //TODO: Check if it's active low
			if(xbox.justPressed(Vars.LIFTER_ADVANCE_BUTTON) && grabSense.get()){ 
				currState = LifterStates.PULL_UP;
			}
			
			break;
			
		case PULL_UP:
			if(xbox.justPressed(Vars.LIFTER_ABORT_BUTTON)){
				currState = LifterStates.TRANSPORT;
			}
			
			pullUpMotor.set(-xbox.getAxisDeadBand(Axes.RIGHTy, .15));
			telescopingMotor.set(xbox.getAxisDeadBand(Axes.LEFTy, 0.15));
			
			if(xbox.justPressed(Vars.LIFTER_ADVANCE_BUTTON)){
				currState = LifterStates.LOCKED;
			}
				
			
			break;
			
		case LOCKED:

			break;
			
		case STARTUP_RESET:
			telescopingMotor.set(xbox.getAxisDeadBand(Axes.RIGHTy, .15));

            //TODO: Check if it's active low
			if(xbox.justPressed(Vars.LIFTER_ADVANCE_BUTTON)){ 
				currState = LifterStates.TRANSPORT;
			}
		}
		
	}
	/**
	 * Call this method periodically to update the state machine
	 */
	public void doAuto(){ //Spam-Called when auto enabled
		if(autoEnabled){
			update();
		}
	}
	/**
	 * Use this method to enable/disable the state machine
	 * @param enabled
	 */
	public void setAutoEnabled(boolean enabled){
		autoEnabled = enabled;
	}
	/**
	 * returns the current state of the lifter
	 * @return
	 */
	public LifterStates getCurrState(){
		return currState;
	}
	/**
	 * Use this to manually set the state of the lifter
	 * @param currState
	 */
	public void setCurrState(LifterStates currState){
		this.currState = currState;
	}
	public enum LifterStates{
		TRANSPORT,
		DEPLOY_ARM,
		EXTEND,
		PULL_UP,
		LOCKED,
		STARTUP_RESET;
	}
	
}
