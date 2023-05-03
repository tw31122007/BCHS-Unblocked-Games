package org.usfirst.frc.team871.robot;

import edu.wpi.first.wpilibj.DigitalInput;
import edu.wpi.first.wpilibj.SpeedController;

public class LimitedSpeedController implements SpeedController{
	SpeedController motor;
	DigitalInput upperLimit;
	DigitalInput lowerLimit;

	public LimitedSpeedController(DigitalInput upperLimit, 
                                    DigitalInput lowerLimit, 
                                    SpeedController motor) {
		this.motor = motor;
		this.upperLimit = upperLimit;
		this.lowerLimit = lowerLimit;
		
	}

	/**
	 * To be called in the PIDController
	 * @param output
	 */
	@Override
	public void pidWrite(double output) {
		motor.pidWrite(getLimitedSpeed(output));
		
	}
	/**
	 * Gets the motor output
	 * @return
	 */
	@Override
	public double get() {
		return motor.get();
	}
	/**
	 * Sets the speed of the motor as long as it's within the limits
	 * @param speed
	 * @param syncGroup
	 */
	@Override
	public void set(double speed, byte syncGroup) {
		
		motor.set(getLimitedSpeed(speed), syncGroup);
	}
	/**
	 * Sets the speed of the motor as long as it's within the limits
	 * @param speed
	 */
	@Override
	public void set(double speed) {
		motor.set(getLimitedSpeed(speed));
		
	}
	/**
	 * Inverts the motor speed
	 * @param isInverted
	 */
	@Override
	public void setInverted(boolean isInverted) {
		motor.setInverted(isInverted);
		
	}
	/**
	 * Returns true is the motor is inverted
	 * @return
	 */
	@Override
	public boolean getInverted() {
		return motor.getInverted();
	}
	/**
	 * Disables the motor
	 */
	@Override
	public void disable() {
		motor.disable();
		
	}
	/**
	 * To be called by inherited set methods. 
     * Passes along the speed as long as it's within the range
	 * @param speed
	 * @return
	 */
	private double getLimitedSpeed(double speed){ //TODO: direction
		double limitedSpeed = 0;
		if(upperLimit.get() && (speed > 0)){
			limitedSpeed = 0;
		}else if(lowerLimit.get() && (speed < 0)){
			limitedSpeed = 0;
		}else{
			limitedSpeed = speed;
		}
		return limitedSpeed;
	}
	
	/**
	 * Returns true if the beater bar is at the lower limit
	 * @return
	 */
	public boolean isAtLowerLimit(){
		return lowerLimit.get();
	}
	/**
	 * Returns true if the beater bar is at the upper limit
	 * @return
	 */
	public boolean isAtUpperLimit(){
		return upperLimit.get();
	}

}
