'=====================================================
'DESIGN YOUR OWN NUCLEAR REACTOR
'       Copyright
'    @ H. Peter Alesso
'       7/15/93
'=====================================================
Global Const safetyfactor = 2, pi = 3.141526, convheatcap = 4180
'{j/kg-K :Note: flowrate in kg}
Const convdensityc = .016
'{g/cc}
Const conventhalpyc = 2.3
'{j/g}
Const barn = 1E-24
'{cm^2}
Global namefuel As String
Global namecool1  As String
Global namecool2  As String
Global namemod   As String
Global namegeo   As String
Global nameplot  As String
Global OutputText1 As String
Global OutputText2 As String
Global OutputText3 As String
Global OutputText4 As String
Global OutputText5 As String
Global OutputText6 As String
Global OutputText7 As String
Global OutputText8 As String
Global OutputText9 As String
Global OutputText10 As String
Global OutputText11 As String
Global OutputText12 As String
Global OutputText13 As String
Global OutputText14 As String
Global OutputText15 As String
Global OutputText16 As String
Global OutputText17 As String
Global OutputText18 As String
Global OutputText19 As String
Global OutputText20 As String
Global OutputText21 As String
Global OutputText22 As String
Global OutputText23 As String
Global OutputText24 As String
Global OutputText25 As String


Global InputText1 As String
Global InputText2 As String
Global InputText3 As String
Global InputText4 As String
Global InputText5 As String
Global InputText6 As String
Global InputText7 As String
Global InputText8 As String
Global InputText9 As String
Global InputText10 As String
Global InputText11 As String
Global InputText12 As String
Global InputText13 As String

Global cr    As Variant
Global cheight  As Variant
Global lx       As Variant
Global ly       As Variant
Global lz       As Variant
Global r        As Variant
Global Volume   As Variant
Global heatflux As Variant
Global densityc As Variant
Global densitym As Variant
Global densityf As Variant
Global Nm       As Variant
Global porosity As Variant
Global flowrate As Variant
Global ratio    As Variant
Global diffus   As Variant
Global ccrossabs As Variant
Global fermi As Variant
Global mcrossabs As Variant
Global fcrossabs As Variant
Global crosscatf As Variant
Global crossfiss As Variant
Global SpecificPower As Variant
Global Effic As Variant
Global heatcap As Variant
Global Neta As Variant
Global Sec_Temperature(4 To 7) As Variant
Global Sec_Enthalpy(4 To 7) As Variant
Global Sec_Pressure(4 To 7) As Variant
Global DeltaT As Variant
Global MaxVelHe As Variant
Global Maxvelh2 As Variant
Global FuelTemp As Variant
Global velocity As Variant
Global crossabs1 As Variant
Global Nf As Variant
Global N_Flux  As Variant
Global numbertubes As Variant
Global burnup As Variant
Global Pressurec As Variant
Global tubelength As Variant
Global tubedia As Variant
Global mintemp As Variant
Global maxtemp As Variant
Global Af As Variant
Global Am As Variant
Global massc As Variant
Global massm As Variant
Global massf As Variant
Global Powerdensity As Variant
Global Powerel  As Variant
Global CritMass As Variant
Global Buckling As Variant
Global thermalconduct As Variant
Global powerth  As Variant

Global enthalpyc As Variant
Global heatvolume As Variant
Global tubevolume As Variant
Global tubearea As Variant
Global Sec_Flowrate  As Variant
Global Turbine_Power As Variant
Global Cond_Pump_Power As Variant
Global Pri_Pressure As Variant
Global Pump_Power As Variant
Global viscosity As Variant
Global Rx_Pressure_Drop As Variant
Global AdjVol As Variant

' don't forget to set directory for help !!!!

Global Const HELP_FILE = "c:\vb\apply\rx\BJ.HLP"
'Windows help API:
Declare Sub winhelp Lib "User" (ByVal hWnd As Integer, ByVal lpHelpFile As String, ByVal wCommand As Integer, ByVal dwData As Long)
'Following are for Windows help system
'Global Const HELPKEYCODE = 112  ' F1
Global Const HELP_CONTEXT = 1, HELP_QUIT = 2   ' , HELP_INDEX = 3

' File I/O
Global save(1 To 13) As String * 12
'Drag & Drop
Global dragx As Single, dragy As Single
Global buffernamefuel As String
Global buffernamemod As String
Global buffernamecool1 As String
Global buffernamecool2 As String
Global buffernamegeo As String
Global NL As String

Sub Cal_Coolant ()
'{This  does all remaining power }
'{conversion calculations}
 Dim velx As Variant
     If namecool1 = "H2O" Then
          water
          ccrossabs = .66
          velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi)
        End If
     If namecool1 = "D2O" Then
        water
          ccrossabs = .001
          velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi)
        End If
     If namecool1 = "H2" Then
        hydrogen
          velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi)
          Pressurec = 1
          ccrossabs = .33
          '{1/3 of Mach 1}
          Maxvelh2 = (((1.4 * 8315 * maxtemp) / 2) ^ .5) / 3
   
If (velocity > Maxvelh2) Then
             
               velx = velocity / Maxvelh2
               Pressurec = Pressurec * 2 * velx
               velocity = Maxvelh2
             End If
        End If
     If namecool1 = "He" Then
        
       helium
          velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi)
          Pressurec = 1
          ccrossabs = .007
          
          MaxVelHe = (((1.66 * 8315 * maxtemp) / 8) ^ .5) / 3
     End If
          If (velocity > MaxVelHe) Then
            MaxVelHe = 1 ' change this when fix above
            velx = velocity / MaxVelHe
            Pressurec = Pressurec * 2 * velx
            velocity = MaxVelHe
            End If
     If namecool1 = "Sodium" Then
        
          sodium
          velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi)
          Pressurec = 1
          ccrossabs = .525
        End If

End Sub

Sub Cal_Critical_Mass ()
'  {This  does the criticality analysis}
  Const Neta = 2.06
    Const Avagodro_Number = 6.06E+23
 Dim crit As Variant
 Dim a As Variant
 Dim b As Variant
 Dim factor As Variant
 Dim terma As Variant
 Dim termb As Variant
 Dim termi As Variant

     a = fcrossabs
     factor = massm / (massc + massm)
     b = ((factor * mcrossabs) + (1 - factor) * ccrossabs)
     termi = (-Buckling * fermi)
       ' If (termi > -37.5) And (termi < 37.5) Then
       terma = (Neta * Exp(termi)) - 1
      '  Else
   ' End If
                            ' terma = -1
      termb = (1 + diffus * Buckling)
      ratio = (terma * a) / (termb * b)
      Nm = (densitym * Avagodro_Number) / Am
      Nf = Nm / ratio
      CritMass = Volume * (Af / Am) * (densitym / ratio) * (1000)
        
        If CritMass < 0 Then
           CritMass = .0001
     Warning
    End If
End Sub

 Sub Cal_Fuel_Temperature ()
'  { degrees Kelvin}
      FuelR = ((1 / (1 - porosity)) * tubedia / 2)
      If (FuelR < .4) Then FuelR = .4
     FuelTemp = maxtemp + 200 + (100 * Powerdensity * FuelR * FuelR) / (4 * 1.73 * thermalconduct)
     End Sub

Sub Cal_Heat_Flux ()
     tubearea = (pi * tubedia * tubelength * numbertubes)
     heatflux = (powerth * 1000000) / (tubearea)
End Sub

'{=================================================================}
Sub Cal_Mass ()
'             {MegaGrams}
      massm = densitym * AdjVol
      massc = densityc * (Volume * porosity)
      burnup = (365 * powerth / (1 * 10 ^ 6))
End Sub

'{=================================================================}
Sub Cal_Neutron_Flux ()
N_Flux = (powerth * 3.1 * 10 ^ 10) / (Volume * Nf * crossfiss * barn)
End Sub

Sub Cal_Number_Tubes ()
     heatvolume = porosity * Volume * (1000000)
     tubevolume = ((tubedia * tubedia) / 4) * pi * tubelength
     numbertubes = (heatvolume / tubevolume)
End Sub

'{=================================================================}
Sub Cal_Power_Density ()
'   {MW}
      DeltaT = (maxtemp - mintemp)
      powerth = heatcap * (maxtemp - mintemp) * flowrate / (1000000)
      AdjVol = Volume * (1 - porosity)
      Powerdensity = powerth / AdjVol
    End Sub

'{=================================================================}
Sub Cal_Pri_Pump_Power ()
' {Megawatts}
   Pump_Effic = .8
  Pump_Power = Pump_Effic * Rx_Pressure_Drop * (pi * tubedia * tubedia / 4) * numbertubes * velocity * .00001
  Pump_Power = 1
  End Sub

'{=================================================================}
Sub Cal_Primary_Pressure ()
' {atmos.}
      Pri_Pressure = Pressurec - Rx_Pressure_Drop
    If Pri_Pressure < 0 Then Pri_Pressure = 1
     Pri_Pressure = 45
End Sub

'{=================================================================}
Sub Cal_Rx_Pressure_Drop ()
'{R_ Uses English units, smooth pipe, turbulent flow}
             ' {Incompressible fluid, no height, no acceleration contribution}
  gc = 9.8
  
    R_velocity = velocity * 11880
    R_densityc = densityc / .016
    R_tubedia = tubedia / 30.48
   Reynolds_Number = (R_velocity * R_densityc * R_tubedia) / viscosity
   friction_factor = (.079) / (((Reynolds_Number) ^ .5) ^ .5)
   term_pd1 = 1.5 * 4 * friction_factor * (tubelength / tubedia)
  Rx_Pressure_Drop = (term_pd1 * densityc * 100 * velocity * velocity) / (2 * gc * 1034)
 
End Sub

'{=================================================================}
Sub Cal_Sec_Condensate_Pump ()
'    {Megawatts}
     Term1 = (Sec_Enthalpy(7) - Sec_Enthalpy(6)) * conventhalpyc * 1000#
     Cond_Pump_Power = Sec_Flowrate * flowrate * .000001
   End Sub

'{=================================================================}
Sub Cal_Sec_Flowrate ()
' {kg/sec}
    Term1 = (Sec_Enthalpy(4) - Sec_Enthalpy(7)) * conventhalpyc
    Sec_Flowrate = (powerth * 1000) / (Term1)
   End Sub

'{=================================================================}
Sub Cal_Sec_Turbine_Power ()
'     {Megawatts}
    If (namecool1 <> "H2") Then
      Term1 = (Sec_Enthalpy(4) - Sec_Enthalpy(5)) * conventhalpyc * 1000#
       Turbine_Power = Sec_Flowrate * Term1 * .000001
        End If
     If namecool1 = "Sodium" Then
          sodium
          velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi)
          Pressurec = 1
          ccrossabs = .525
        End If
Turbine_Power = flowrate * heatcap * (maxtemp - mintemp) * (.36) * (.000001)
End Sub

'{=================================================================}
Sub Cal_Specific_power ()
'   {kw/g}
         SpecificPower = (powerth) / (CritMass)
End Sub

'
Sub Cal_Sys_Efficiency ()
      Effic = (100) * (Turbine_Power / powerth)
End Sub

Sub Calculation_Phase ()
     Cal_Number_Tubes
     Cal_Coolant
     Cal_Rx_Pressure_Drop
     Cal_Primary_Pressure
     Cal_Pri_Pump_Power
     Cal_Power_Density
     Cal_Fuel_Temperature
     Cal_Mass
     Cal_Heat_Flux
     Cal_Critical_Mass
     Cal_Specific_power
     Cal_Neutron_Flux
     Cal_Sec_Flowrate
     Cal_Sec_Turbine_Power
     Cal_Sec_Condensate_Pump
     Cal_Sys_Efficiency
   End Sub

Sub helium ()
    heatcap = 1.242 * convheatcap
    If (mintemp <= 60) Then
    densityc = .0915
    End If
    If (mintemp > 60) And (mintemp <= 100) Then
    densityc = .211
     End If
    If (mintemp > 100) And (mintemp <= 150) Then
    densityc = .0152
     End If
    If (mintemp > 150) And (mintemp <= 200) Then
    densityc = .0119
     End If
    If (mintemp > 200) And (mintemp <= 353) Then
    densityc = .0083
     End If
    If (mintemp > 353) And (mintemp <= 593) Then
    densityc = .00517
     End If
    If (mintemp > 593) And (mintemp <= 920) Then
    densityc = .00376
     End If
    If (mintemp > 920) Then
    densityc = .0033
     End If
    densityc = densityc * convdensityc
    If (mintemp <= 400) Then
    viscosity = .045
     End If
    If (mintemp > 400) And (mintemp <= 800) Then
    viscosity = .06
     End If
    If (mintemp > 800) Then
    viscosity = .09
     End If
End Sub

Sub hydrogen ()

Dim heatcap1 As Variant

    If (mintemp <= 30) Then
    
       heatcap1 = 2.589
       densityc = .052
    End If
    If (mintemp > 30) And (mintemp <= 50) Then
      
       heatcap1 = 2.508
       densityc = .031
    End If
    If (mintemp > 50) And (mintemp <= 100) Then
       heatcap1 = 2.682
       densityc = .015
    End If
    If (mintemp > 100) And (mintemp <= 150) Then
      
       heatcap1 = 3.101
       densityc = .01
     End If
    If (mintemp > 150) And (mintemp <= 200) Then
      
       heatcap1 = 3.234
       densityc = .0076
     End If
    If (mintemp > 200) And (mintemp <= 250) Then
      
       heatcap1 = 3.358
       densityc = .00613
     End If
    If (mintemp > 250) And (mintemp <= 300) Then
      
       heatcap1 = 3.419
       densityc = .0055
     End If
    If (mintemp > 300) And (mintemp <= 350) Then
      
       heatcap1 = 3.448
       densityc = .0051
     End If
    If (mintemp > 350) And (mintemp <= 400) Then
      
       heatcap1 = 3.461
       densityc = .0044
     End If
    If (mintemp > 400) And (mintemp <= 450) Then
      
       heatcap1 = 3.463
       densityc = .0038
    End If
    If (mintemp > 450) And (mintemp <= 500) Then
      
       heatcap1 = 3.465
       densityc = .0034
     End If
    If (mintemp > 500) And (mintemp <= 550) Then
      
       heatcap1 = 3.471
       densityc = .00307
      End If
    If (mintemp > 550) And (mintemp <= 600) Then
      
       heatcap1 = 3.47
       densityc = .00279
     End If
    If (mintemp > 600) And (mintemp <= 700) Then
      
       heatcap1 = 3.481
       densityc = .00255
     End If
    If (mintemp > 700) And (mintemp <= 800) Then
      
       heatcap1 = 3.505
       densityc = .00218
     End If
    If (mintemp > 800) And (mintemp <= 900) Then
      
       heatcap1 = 3.54
       densityc = .0019
      End If
    If (mintemp > 900) And (mintemp <= 1000) Then
      
       heatcap1 = 3.575
       densityc = .0017
     End If
    If (mintemp > 1000) And (mintemp <= 1100) Then
      
       heatcap1 = 3.622
       densityc = .0015
      End If
    If (mintemp > 1100) And (mintemp <= 1200) Then
    
       heatcap1 = 3.67
       densityc = .00139
     End If
    If (mintemp > 1200) And (mintemp <= 1300) Then
      
       heatcap1 = 3.72
       densityc = .00128
       End If
    If (mintemp > 1300) Then
      
       heatcap1 = 3.735
       densityc = .00118
    End If
    heatcap = heatcap1 * convheatcap
    densityc = densityc * convdensityc
    viscosity = .022

End Sub

Sub sodium ()

Dim heatcap1 As Variant
  
    If (mintemp > 300) And (mintemp <= 373) Then
      
       heatcap1 = .3305
       densityc = 57.87
       viscosity = 2
      End If
    If (mintemp > 373) And (mintemp <= 473) Then
      
       heatcap1 = .32
       densityc = 56.44
       viscosity = 1.7
      End If
    If (mintemp > 473) And (mintemp <= 573) Then
      
       heatcap1 = .3116
       densityc = 55.06
       viscosity = 1.089
      End If
    If (mintemp > 573) And (mintemp <= 673) Then
  
       heatcap1 = .3055
       densityc = 53.63
       viscosity = .835
      End If
    If (mintemp > 673) And (mintemp <= 773) Then
      
       heatcap1 = .3015
       densityc = 52.07
       viscosity = .687
      End If
    If (mintemp > 773) And (mintemp <= 873) Then
      
       heatcap1 = .2998
       densityc = 50.51
       viscosity = .587
      End If
    If (mintemp > 873) And (mintemp <= 973) Then
      
       heatcap1 = .3003
       densityc = 48.48
       viscosity = .508
      End If
    If (mintemp > 973) And (mintemp <= 1073) Then
      
       heatcap1 = .303
       densityc = 47.26
       viscosity = .45
      End If
    If (mintemp > 1073) And (mintemp <= 1173) Then
      
       heatcap1 = .3079
       densityc = 46.5
       viscosity = .39
      End If
    If (mintemp > 1173) Then
      
       heatcap1 = .3
       densityc = 45
       viscosity = .362
      End If
    heatcap = heatcap1 * convheatcap
    densityc = densityc * convdensityc

End Sub

Sub Warning ()
MsgBox "WARNING ! This Reactor design will not achieve CRITICALITY!", 48, " WARNING"
End Sub

Sub water ()
  Dim heatcap1    As Variant
  
    If (mintemp <= 273) Then
             
               enthalpyc = .01
               viscosity = 4.32

               heatcap1 = 1
               Pressurec = .0235
               densityc = 62.57
             End If
    If (mintemp > 273) And (mintemp <= 293) Then
            
               enthalpyc = 36.09
               viscosity = 4.32
               heatcap1 = 1.0074
               Pressurec = .0728
               densityc = 62.46
            End If
    If (mintemp > 293) And (mintemp <= 313) Then
            
              enthalpyc = 72.04
              viscosity = 3.1
              heatcap1 = .9988
              Pressurec = .199
              densityc = 62.09
            End If
    If (mintemp > 313) And (mintemp <= 333) Then
            
              enthalpyc = 108.9
              viscosity = 1.61
              heatcap1 = .998
              Pressurec = .47
              densityc = 61.52
            End If
    If (mintemp > 333) And (mintemp <= 353) Then
            
              enthalpyc = 143.9
              viscosity = 1.05
              heatcap1 = .9994
              Pressurec = 1
              densityc = 60.81
            End If
    If (mintemp > 353) And (mintemp <= 373) Then
    
              enthalpyc = 180.1
              viscosity = .74
              heatcap1 = 1.002
              Pressurec = 1.958
              densityc = 59.97
            End If
    If (mintemp > 373) And (mintemp <= 393) Then
            
              enthalpyc = 216.5
              viscosity = .6
              heatcap1 = 1.007
              Pressurec = 3.565
              densityc = 59.01
            End If
    If (mintemp > 393) And (mintemp <= 413) Then
            
              enthalpyc = 253.3
              viscosity = .5
              heatcap1 = 1.015
              Pressurec = 6.27
              densityc = 57.95
            End If
    If (mintemp > 413) And (mintemp <= 433) Then
    
              enthalpyc = 292.1
              viscosity = .4
              heatcap1 = 1.023
              Pressurec = 9.86
              densityc = 56.79
            End If

    If (mintemp > 433) And (mintemp <= 453) Then
    
              enthalpyc = 328
              viscosity = .3
              heatcap1 = 1.037
              Pressurec = 15.305
              densityc = 55.5
            End If
    If (mintemp > 453) And (mintemp <= 473) Then

              enthalpyc = 366.4
              viscosity = .25
              densityc = 54.11
              heatcap1 = 1.05
              Pressurec = 23.3
            End If
    If (mintemp > 473) And (mintemp <= 493) Then
            
              enthalpyc = 413
              viscosity = .2
              heatcap1 = 1.076
              Pressurec = 33.3
              densityc = 52.59
            End If
    If (mintemp > 493) And (mintemp <= 513) Then
            
              enthalpyc = 447
              viscosity = .16
               heatcap1 = 1.101
              Pressurec = 46.24
              densityc = 50.92
            End If
    If (mintemp > 513) And (mintemp <= 533) Then
            
              enthalpyc = 487
              viscosity = .16
              heatcap1 = 1.136
              Pressurec = 62.7
              densityc = 49.02

            End If
    If (mintemp > 533) And (mintemp <= 553) Then
            
              enthalpyc = 530
              viscosity = .16
              heatcap1 = 1.182
              Pressurec = 83.3
              densityc = 46.98
            End If
    If (mintemp > 553) And (mintemp <= 573) Then
            
              enthalpyc = 575
              viscosity = .16
              heatcap1 = 1.244
              Pressurec = 111.56
              densityc = 44.59
            End If
    If (mintemp > 573) And (mintemp <= 593) Then
            
              enthalpyc = 631
              viscosity = .16
              heatcap1 = 1.368
              Pressurec = 144.21
              densityc = 43
            End If
    If (mintemp > 593) Then
            
              enthalpyc = 687
              viscosity = .16
              heatcap1 = 1.3
              Pressurec = 184
              densityc = 42
              End If
    heatcap = heatcap1 * convheatcap
    Pressurec = Pressurec * safetyfactor
    densityc = densityc * convdensityc
    enthalpyc = enthalpyc * conventhalpyc


End Sub

