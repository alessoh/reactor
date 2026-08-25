VERSION 2.00
Begin Form FrmInput 
   BackColor       =   &H00E0E0E0&
   Caption         =   "REACTOR INPUT "
   ClientHeight    =   4545
   ClientLeft      =   480
   ClientTop       =   1335
   ClientWidth     =   6855
   FillColor       =   &H00FF0000&
   Height          =   4950
   Left            =   420
   LinkTopic       =   "Form1"
   ScaleHeight     =   4545
   ScaleWidth      =   6855
   Top             =   990
   Width           =   6975
   Begin SSFrame Frame3D1 
      Font3D          =   0  'None
      ForeColor       =   &H00000000&
      Height          =   4575
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   6975
      Begin TextBox Text13 
         Height          =   375
         Left            =   5040
         TabIndex        =   14
         Text            =   "Text13"
         Top             =   3480
         Width           =   1695
      End
      Begin TextBox Text12 
         Height          =   375
         Left            =   240
         TabIndex        =   13
         Text            =   "Text12"
         Top             =   3480
         Width           =   4695
      End
      Begin TextBox Text11 
         Height          =   375
         Left            =   5040
         TabIndex        =   12
         Text            =   "Text11"
         Top             =   3120
         Width           =   1695
      End
      Begin TextBox Text10 
         Height          =   375
         Left            =   240
         TabIndex        =   11
         Text            =   "Text10"
         Top             =   3120
         Width           =   4695
      End
      Begin TextBox Text9 
         Height          =   375
         Left            =   5040
         TabIndex        =   10
         Text            =   "Text9"
         Top             =   2760
         Width           =   1695
      End
      Begin TextBox Text8 
         Height          =   375
         Left            =   240
         TabIndex        =   9
         Text            =   "Text8"
         Top             =   2760
         Width           =   4695
      End
      Begin CommandButton Command1 
         Caption         =   "EXIT"
         Height          =   495
         Left            =   6120
         TabIndex        =   8
         Top             =   360
         Width           =   615
      End
      Begin TextBox Text7 
         Height          =   375
         Left            =   5040
         TabIndex        =   7
         Text            =   "Text7"
         Top             =   2400
         Width           =   1695
      End
      Begin TextBox Text6 
         Height          =   375
         Left            =   240
         TabIndex        =   6
         Text            =   "Text6"
         Top             =   2400
         Width           =   4695
      End
      Begin TextBox Text5 
         Height          =   375
         Left            =   5040
         TabIndex        =   5
         Text            =   "Text5"
         Top             =   2040
         Width           =   1695
      End
      Begin TextBox Text4 
         Height          =   375
         Left            =   240
         TabIndex        =   4
         Text            =   "Text4"
         Top             =   2040
         Width           =   4695
      End
      Begin TextBox Text3 
         Height          =   375
         Left            =   5040
         TabIndex        =   3
         Text            =   "Text3"
         Top             =   1680
         Width           =   1695
      End
      Begin TextBox Text2 
         Height          =   375
         Left            =   240
         TabIndex        =   2
         Text            =   "Text2"
         Top             =   1680
         Width           =   4695
      End
      Begin TextBox Text1 
         BackColor       =   &H00FFC0C0&
         ForeColor       =   &H00FF0000&
         Height          =   1095
         Left            =   240
         TabIndex        =   1
         Text            =   "Text1"
         Top             =   360
         Width           =   5775
      End
   End
End
Sub Command1_Click ()
Unload Me
End Sub

Sub Form_Load ()

text1.Text = inputtext1
text2.Text = inputtext2
Text3.Text = InputText3
 
text4.Text = inputtext4
Text5.Text = InputText5
text6.Text = inputtext6
Text7.Text = InputText7
text8.Text = inputtext8
Text9.Text = InputText9
text10.Text = inputtext10
Text11.Text = InputText11
text12.Text = inputtext12
Text13.Text = InputText13

End Sub

Sub Text11_Change ()
InputText11 = Text11.Text
End Sub

Sub Text13_Change ()
InputText13 = Text13.Text
End Sub

Sub Text3_Change ()
    
 InputText3 = Text3.Text
      
End Sub

Sub Text5_Change ()
   
    InputText5 = Text5.Text
End Sub

Sub Text7_Change ()
InputText7 = Text7.Text
End Sub

Sub Text9_Change ()
InputText9 = Text9.Text
End Sub

