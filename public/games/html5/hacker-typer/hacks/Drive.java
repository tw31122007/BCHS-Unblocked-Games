package org.usfirst.frc.team871.robot;

import edu.wpi.first.wpilibj.SpeedController;
import edu.wpi.first.wpilibj.networktables.NetworkTable;

public class Drive {

	private SpeedController driveL, driveR;
	
	public static final byte SIDE_L = 0;
	public static final byte SIDE_R = 1;
	public boolean enabled = false; //TODO: Check

	final NetworkTable dashboard = NetworkTable.getTable("SmartDashboard");
	
	public Drive(SpeedController driveL, SpeedController driveR){
		this.driveL = driveL;
		this.driveR = driveR;
	}
	
	/**
	 * Side is 0 for left, 1 for right. Speed should be from -1 to +1.
	 */
	public void driveMotor(byte side, double speed){
		switch (side) {
		case SIDE_L:
			driveL.set(speed);
			break;
		
		case SIDE_R:
			driveR.set(speed);
			break;
			
		default:
			//Invalid Motor Side.
			break;
		}
	}
	
	/**
	 * Drive both sides in one method. Speeds should be from -1 to +1.
	 */
	public void driveBothMotors(double speedL, double speedR){
		driveMotor(SIDE_L, speedL);
		
		driveMotor(SIDE_R, speedR);
	}
	
	/**
	 * Returns the speed from -1 to +1 for the given side.
	 */
	public double getSpeed(byte side){
		double speed = 0;
		
		switch (side) {
		case SIDE_L:
			speed = driveL.get();
			break;
		
		case SIDE_R:
			speed = driveR.get();
			break;
			
		default:
			//Invalid Motor Side
			break;
		}
		
		return speed;
	}
	
	public void autoAim(){
//		double centerOfMassX = dashboard.getNumber("centerOfMassX", 0.0);
//
//		if(centerOfMassX > Vars.TARGET_CENTER_OF_MASS_X_UPPER_BOUND){
//			driveBothMotors(-.1, .1);//TODO: direction
//		}else if(centerOfMassX < Vars.TARGET_CENTER_OF_MASS_X_LOWER_BOUND){
//			driveBothMotors(.1, -.1);//TODO: direction
//		}
	}
	
}
