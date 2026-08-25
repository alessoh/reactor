VERSION 2.00
Begin Form AboutBox 
   BackColor       =   &H00E0E0E0&
   BorderStyle     =   3  'Fixed Double
   Caption         =   "About"
   ClientHeight    =   3045
   ClientLeft      =   2475
   ClientTop       =   1395
   ClientWidth     =   4785
   Height          =   3450
   Left            =   2415
   LinkMode        =   1  'Source
   LinkTopic       =   "Form2"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   3045
   ScaleWidth      =   4785
   Top             =   1050
   Width           =   4905
   Begin CommandButton Command1 
      Cancel          =   -1  'True
      Caption         =   "OK"
      Default         =   -1  'True
      Height          =   495
      Left            =   1800
      TabIndex        =   3
      Top             =   2400
      Width           =   1215
   End
   Begin Label Label1 
      BackColor       =   &H00E0E0E0&
      Caption         =   "DESIGN YOUR OWN NUCLEAR REACTOR"
      FontBold        =   -1  'True
      FontItalic      =   0   'False
      FontName        =   "MS Sans Serif"
      FontSize        =   9.75
      FontStrikethru  =   0   'False
      FontUnderline   =   0   'False
      Height          =   615
      Left            =   1200
      TabIndex        =   0
      Top             =   360
      Width           =   2295
   End
   Begin Label Label3 
      BackColor       =   &H00E0E0E0&
      Caption         =   "Version 4.0"
      FontBold        =   -1  'True
      FontItalic      =   0   'False
      FontName        =   "MS Sans Serif"
      FontSize        =   9.75
      FontStrikethru  =   0   'False
      FontUnderline   =   0   'False
      Height          =   255
      Left            =   1680
      TabIndex        =   1
      Top             =   1200
      Width           =   1455
   End
   Begin Label Label4 
      BackColor       =   &H00E0E0E0&
      Caption         =   "(c) Copyright Alesso 1993"
      FontBold        =   -1  'True
      FontItalic      =   0   'False
      FontName        =   "MS Sans Serif"
      FontSize        =   9.75
      FontStrikethru  =   0   'False
      FontUnderline   =   0   'False
      Height          =   375
      Left            =   960
      TabIndex        =   2
      Top             =   1800
      Width           =   2775
   End
End

Sub Command1_Click ()
  Unload aboutbox
End Sub

