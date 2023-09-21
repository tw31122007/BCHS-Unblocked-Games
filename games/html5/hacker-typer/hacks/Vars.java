package org.usfirst.frc.team871.robot;

import org.usfirst.frc.team871.robot.Logitech.ButtonType;
import org.usfirst.frc.team871.robot.XBoxController.Axes;
import org.usfirst.frc.team871.robot.XBoxController.Buttons;

public class Vars {
	
	public static final int DEFAULT_NUMBER = 9;
	
	public static final long SPIN_UP_TIME   = 1000000000;
	public static final long SPIN_DOWN_TIME = 500000000;
	
	public static final byte BEATER_BAR_LOAD_POINT      = DEFAULT_NUMBER; //TODO
	public static final byte BEATER_BAR_TRANSPORT_POINT = DEFAULT_NUMBER; //TODO
	
	public static final byte SHOOTER_LOAD_POINT      = DEFAULT_NUMBER; //TODO
	public static final byte SHOOTER_TRANSPORT_POINT = DEFAULT_NUMBER; //TODO
	
	public static final double DEFAULT_AXIS_DEADBAND = 0.1;
	
	//Ports
	
	//Talons
	 //PWM
	public static final byte BEATER_BAR_ROLLER_PORT = 2; //beater bar roller, pwm
	public static final byte BEATER_BAR_POS_PORT    = 3; //beater bar lifter?
	 //CanBus
	public static final byte WINCH_PORT        =  0; //robor lift wench?
	public static final byte TELESCOPE_PORT    =  1; //hook  lift wench?
	public static final byte SHOOTER_AIM_PORT  =  2; //shooter lift motor?
	public static final byte FIRE_MOTOR_1_PORT =  3; //left  shooter motor?
	public static final byte FIRE_MOTOR_2_PORT = 12; //right shooter motor?
	public static final byte DRIVE_RIGHT_PORT  = 13; //right drive motor
	public static final byte DRIVE_LEFT_PORT   = 14; //left drive motor

	//Solenoids
	public static final byte LIFT_PISTON_FORWARD_PORT   = 1; //arm pistons, out
	public static final byte LIFT_PISTON_REVERSE_PORT   = 6; //arm pistons, in
	public static final byte FIRE_PISTON_FORWARD_PORT   = 7; //shooter, out
	public static final byte FIRE_PISTON_REVERSE_PORT   = 0; //shooter, in
	public static final byte LOCK_SOLENOID_FORWARD_PORT	= 4; //TODO
	public static final byte LOCK_SOLENOID_REVERSE_PORT = 5; //TODO
	
	//DigitalInputs
	public static final byte GRAB_SENSE_PORT                  = 3; //TODO
	public static final byte TELESCOPE_UPPER_LIMIT_SENSE_PORT = 6; //TODO
	public static final byte TELESCOPE_LOWER_LIMIT_SENSE_PORT = 4; //TODO
	public static final byte LOADED_SENSE_PORT                = 5; //TODO
	public static final byte ARM_DEPLOYED_SENSE_PORT          = 2; //lift hook upper limit
	public static final byte SHOOTER_UPPER_LIMIT_PORT         = 0; //Thrower upper limit, active low
	public static final byte SHOOTER_LOWER_LIMIT_PORT         = 1; //Thrower lower limit, active low
	
	//Joysticks
	public static final byte JOYSTICK_1_PORT    = 0; //TODO
	public static final byte JOYSTICK_2_PORT    = 1; //TODO
	public static final byte XBOX_JOYSTICK_PORT = 4; //TODO
	
	//Controls
	public static final Buttons LIFTER_ADVANCE_BUTTON     = Buttons.A; //TODO
	public static final Buttons LIFTER_ABORT_BUTTON       = Buttons.X; //TODO
	public static final Buttons MANUAL_MODE_TOGGLE_BUTTON = Buttons.Y;
	public static final ButtonType LOAD_BUTTON			  = ButtonType.TWO;
	public static final ButtonType FIRE_BUTTON			  = ButtonType.ONE;
	public static final Axes SHOOTER_RAISE_AXIS_MANUAL    = Axes.rTRIGGER;
	public static final Axes SHOOTER_LOWER_AXIS_MANUAL    = Axes.lTRIGGER;
	public static final Axes BEATER_BAR_MANUAL_CONTROL    = Axes.LEFTy;
	public static final Buttons BEATER_BAR_ROLLER_MANUAL_CONTROL_U = Buttons.RB;
	public static final Buttons BEATER_BAR_ROLLER_MANUAL_CONTROL_D = Buttons.LB;
	
	//Encoder
	public static final byte LIFT_ENCODER_PORT_A      = 9;	//TODO
	public static final byte LIFT_ENCODER_PORT_B      = 10;	//TODO
	public static final byte TELESCOPE_ENCODER_PORT_A = 12;	//TODO
	public static final byte TELESCOPE_ENCODER_PORT_B = 11;	//TODO
	
	//Potentiometer
	public static final byte   SHOOTER_POTENTIOMETER_PORT     = 0; //thrower angle
	public static final byte   TELESCOPE_POTENTIOMETER_PORT   = DEFAULT_NUMBER; //telescope height
	public static final byte   BEATER_BAR_POTENTIOMETER_PORT  = 1; //beater bar
	public static final byte   SHOOTER_POT_TRANSPORT_POSITION = 0;
	public static final double TELESCOPE_POTENTIOMETER_MAX    = DEFAULT_NUMBER; //TODO
	public static final double TELESCOPE_POTENTIOMETER_MIN    = DEFAULT_NUMBER; //TODO
	public static final double BEATER_BAR_POT_DEPLOYED_SETPOINT = 0.46; 
	public static final double BEATER_BAR_POT_FOLDED_SETPOINT   = 0.591; //TODO
	
	//le category
	public static final int TARGET_CENTER_OF_MASS_X_UPPER_BOUND = 163;
	public static final int TARGET_CENTER_OF_MASS_X_LOWER_BOUND = 137;

}
