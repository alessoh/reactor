VERSION 2.00
Begin Form FrmOut 
   Caption         =   "Reactor OUTPUT"
   ClientHeight    =   5865
   ClientLeft      =   540
   ClientTop       =   1320
   ClientWidth     =   8415
   Height          =   6270
   Left            =   480
   LinkTopic       =   "Form1"
   ScaleHeight     =   5865
   ScaleWidth      =   8415
   Top             =   975
   Width           =   8535
   Begin SSFrame Frame3D1 
      Font3D          =   0  'None
      ForeColor       =   &H00000000&
      Height          =   5895
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   8415
      Begin TextBox Text25 
         Height          =   375
         Left            =   5640
         TabIndex        =   26
         Text            =   "Text25"
         Top             =   5040
         Width           =   2415
      End
      Begin TextBox Text24 
         Height          =   375
         Left            =   120
         TabIndex        =   25
         Text            =   "Text24"
         Top             =   5040
         Width           =   5175
      End
      Begin TextBox Text23 
         Height          =   375
         Left            =   5640
         TabIndex        =   24
         Text            =   "Text23"
         Top             =   4680
         Width           =   2415
      End
      Begin TextBox Text22 
         Height          =   375
         Left            =   120
         TabIndex        =   23
         Text            =   "Text22"
         Top             =   4680
         Width           =   5175
      End
      Begin TextBox Text21 
         Height          =   375
         Left            =   5640
         TabIndex        =   22
         Text            =   "Text21"
         Top             =   4320
         Width           =   2415
      End
      Begin TextBox Text20 
         Height          =   375
         Left            =   120
         TabIndex        =   21
         Text            =   "Text20"
         Top             =   4320
         Width           =   5175
      End
      Begin TextBox Text19 
         Height          =   375
         Left            =   5640
         TabIndex        =   20
         Text            =   "Text19"
         Top             =   3960
         Width           =   2415
      End
      Begin TextBox Text18 
         Height          =   375
         Left            =   120
         TabIndex        =   19
         Text            =   "Text18"
         Top             =   3960
         Width           =   5175
      End
      Begin TextBox Text17 
         Height          =   375
         Left            =   5640
         TabIndex        =   18
         Text            =   "Text17"
         Top             =   3600
         Width           =   2415
      End
      Begin TextBox Text16 
         Height          =   375
         Left            =   120
         TabIndex        =   17
         Text            =   "Text16"
         Top             =   3600
         Width           =   5175
      End
      Begin TextBox Text15 
         Height          =   375
         Left            =   5640
         TabIndex        =   16
         Text            =   "Text15"
         Top             =   3240
         Width           =   2415
      End
      Begin TextBox Text14 
         Height          =   375
         Left            =   120
         TabIndex        =   15
         Text            =   "Text14"
         Top             =   3240
         Width           =   5175
      End
      Begin CommandButton Command1 
         Caption         =   "EXIT"
         Height          =   375
         Left            =   7440
         TabIndex        =   14
         Top             =   480
         Width           =   615
      End
      Begin TextBox Text13 
         Height          =   375
         Left            =   5640
         MultiLine       =   -1  'True
         TabIndex        =   13
         Text            =   "Text13"
         Top             =   2880
         Width           =   2415
      End
      Begin TextBox Text12 
         Height          =   375
         Left            =   120
         MultiLine       =   -1  'True
         TabIndex        =   12
         Text            =   "Text12"
         Top             =   2880
         Width           =   5175
      End
      Begin TextBox Text11 
         Height          =   375
         Left            =   5640
         MultiLine       =   -1  'True
         TabIndex        =   11
         Text            =   "Text11"
         Top             =   2520
         Width           =   2415
      End
      Begin TextBox Text10 
         Height          =   375
         Left            =   120
         MultiLine       =   -1  'True
         TabIndex        =   10
         Text            =   "Text10"
         Top             =   2520
         Width           =   5175
      End
      Begin TextBox Text9 
         Height          =   375
         Left            =   5640
         MultiLine       =   -1  'True
         TabIndex        =   9
         Text            =   "Text9"
         Top             =   2160
         Width           =   2415
      End
      Begin TextBox Text8 
         Height          =   375
         Left            =   120
         MultiLine       =   -1  'True
         TabIndex        =   8
         Text            =   "Text8"
         Top             =   2160
         Width           =   5175
      End
      Begin TextBox Text7 
         Height          =   375
         Left            =   5640
         MultiLine       =   -1  'True
         TabIndex        =   7
         Text            =   "Text7"
         Top             =   1800
         Width           =   2415
      End
      Begin TextBox Text6 
         Height          =   375
         Left            =   120
         MultiLine       =   -1  'True
         TabIndex        =   6
         Text            =   "Text6"
         Top             =   1800
         Width           =   5175
      End
      Begin TextBox Text5 
         Height          =   375
         Left            =   5640
         MultiLine       =   -1  'True
         TabIndex        =   5
         Text            =   "Text5"
         Top             =   1440
         Width           =   2415
      End
      Begin TextBox Text4 
         Height          =   375
         Left            =   120
         MultiLine       =   -1  'True
         TabIndex        =   4
         Text            =   "Text4"
         Top             =   1440
         Width           =   5175
      End
      Begin TextBox Text3 
         Height          =   375
         Left            =   5640
         MultiLine       =   -1  'True
         TabIndex        =   3
         Text            =   "Text3"
         Top             =   1080
         Width           =   2415
      End
      Begin TextBox Text2 
         Height          =   375
         Left            =   120
         MultiLine       =   -1  'True
         TabIndex        =   2
         Text            =   "Text2"
         Top             =   1080
         Width           =   5175
      End
      Begin TextBox Text1 
         BackColor       =   &H00FFC0C0&
         FontBold        =   -1  'True
         FontItalic      =   -1  'True
         FontName        =   "Courier New"
         FontSize        =   13.5
         FontStrikethru  =   0   'False
         FontUnderline   =   0   'False
         ForeColor       =   &H00FF0000&
         Height          =   615
         Left            =   120
         MultiLine       =   -1  'True
         TabIndex        =   1
         Text            =   "Text1"
         Top             =   360
         Width           =   7095
      End
   End
End

Sub Command1_Click ()
Unload Me
End Sub

Sub Form_Load ()
text1.Text = outputtext1
text2.Text = outputtext2
text3.Text = outputtext3
text4.Text = outputtext4
text5.Text = outputtext5
text6.Text = outputtext6
text7.Text = outputtext7
text8.Text = outputtext8
text9.Text = outputtext9
text10.Text = outputtext10
text11.Text = outputtext11
text12.Text = outputtext12
text13.Text = outputtext13
text14.Text = outputtext14
text15.Text = outputtext15
text16.Text = outputtext16
text17.Text = outputtext17
text18.Text = outputtext18
text19.Text = outputtext19
text20.Text = outputtext20
text21.Text = outputtext21
text22.Text = outputtext22
text23.Text = outputtext23
text24.Text = outputtext24
text25.Text = outputtext25
End Sub

