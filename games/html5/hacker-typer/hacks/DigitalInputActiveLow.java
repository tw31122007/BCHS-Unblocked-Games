package org.usfirst.frc.team871.robot;

import edu.wpi.first.wpilibj.DigitalInput;

public class DigitalInputActiveLow extends DigitalInput{

	public DigitalInputActiveLow(int channel) {
		super(channel);
		// TODO Auto-generated constructor stub
	}

	@Override
	public boolean get(){
		return !super.get();
	}
	
}
