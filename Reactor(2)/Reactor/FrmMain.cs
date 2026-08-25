// //////////////////////////////////////
// //////////////////////////////////////
// //////////////////////////////////////
//
// H. Peter Alesso
// Deisgn Your Own Reactor
// Copyright 1991, 1993, 2007
//
// //////////////////////////////////////
// //////////////////////////////////////
// //////////////////////////////////////
using System;
using System.Data;
using System.IO;
using System.Text;
using System.ComponentModel;
using System.Windows.Forms;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Printing;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;

namespace Reactor
{

    public partial class FrmMain : Form
    {
        // //////////////////////////////////////
        //
        //
        // GLOBAL VARIABLES
        //
        //
        // //////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////
        public bool bTextChanged;
        // //////////////////////////////////////
        // //////////////////////////////////////
        // FILE IO VARIABLES & PRINTER VARIBLES
        // //////////////////////////////////////
        string m_strFileName = "";
        string m_strRemaining = "";
        StreamReader m_PrintReader;
        PrinterSettings m_PrinterSettings = new PrinterSettings();
        private System.Windows.Forms.PrintDialog printDialog1;
        private System.Windows.Forms.PrintPreviewDialog printPreviewDialog1;
        private System.Windows.Forms.PageSetupDialog pageSetupDialog1;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
        private System.Windows.Forms.SaveFileDialog saveFileDialog1;
        PageSettings m_PageSettings = new PageSettings();
        String MyFilterString = "All files |*.*|XHTML FIles|*.htm|XML FIles |*.xml|XSL FIles |*.xsl|XSD FIles |*.xsd|RDF FIles |*.rdf|OWL FIles |*.owl|HTML Files |*.htm|Text Files |*.txt";
        bool m_bReadOnly = false;
        // //////////////////////////////////////
        // 
        // Physics Variables
        //
        // //////////////////////////////////////
        // Inital Design Varables
        // //////////////////////////////////////
        string namefuel = "U235";
        string namemod = "H2O";
        string namecool1 = "H2O";
        string namecool2 = "H2O";
        string namegeo = "Rectangular";
        double crossfiss = 582;
        double crossabs1 = 106;
        double thermalconduct = 14;
        double  crosscatf = 15;
        double  fcrossabs = 679;
        double  Af = 235;
        double  diffus = 7.617;
        double  fermi = 31.36;
        double  densitym = 1;
        double  mcrossabs = .66;
        double  ccrossabs = .66;
        double  Am = 18;
        // geometry
        //double  LX = 100;
        //double LY = 100;
        //double LZ = 100;
        //double cr = 50;
        //double r = 50;
       // double cheight = 100;
        double numbertubes = 2600;
        double velocity;
        double porosity = .33;
        double maxtemp = 530;
        double mintemp = 470;  

        double tubelength = 100;
        double viscosity = .16;
        double Pri_Pressure = 100;
        double[] Sec_Temperature = new double[4] { 516, 55, 41, 104 };
        double[] Sec_Pressure = new double[4] { 34.9, 0.1436, 0.0769, 34.9 };
        double[] Sec_Enthalpy = new double[4] { 1205, 850, 68, 168 };
        double safetyfactor = 2;
        double pi = 3.141526;
        double convheatcap = 4180;
        double velx;
        double densityc;
        double MaxVelHe;
        double Maxvelh2;
        //{j/kg-K :Note: flowrate in kg}
        double convdensityc = .016;
        //{g/cc}
        double conventhalpyc = 2.3;
        //{j/g}
        double barn = 1E-24;
        //{cm^2}

        // Reactor Output
        double Volume = 1.0;
        double Buckling = 0.00293;
        double ratio;
        double densityf = 19;
        double massm;
        double CritMass;
        double heatflux;
        double FuelTemp = 877;
        double N_Flux;
        double powerth;
        // Primary Output
        double tubedia = .4;
        double pressurec;
        double flowrate = 10000;
        double Pump_Power;
        double massc;
        double DeltaT;
        // Second Output
        double Effic = 34;
        double Cond_Pump_Power;
        double Sec_Flowrate;
        double Turbine_Power; 
        //
        double Rx_Pressure_Drop;
        double Pressurec;
        double AdjVol;
        double Powerdensity;
        double heatvolume;
        double tubevolume;
        double FuelR;
        double Nf; 
        double Nm; 
        double gc = 9.8;
        double heatcap;
        double R_velocity;
        double R_densityc;
        double R_tubedia;
        double Reynolds_Number;
        double friction_factor;
        double term_pd1;
        double Term1;
        double SpecificPower;
        double heatcap1;
        double enthalpyc;
        double tubearea;
        bool fuel = false;
        bool mod = false;
        bool cool = false;

        const string dir = @"C:\myprograms\DYOR\reactor\reactor\";
	    const string path = dir + "MyDBFile.txt";



        // //////////////////////////////////////
        //
        // MAIN FORM
        //
        // //////////////////////////////////////
        public FrmMain()
        {
            InitializeComponent();
            textBox1.Text = "Rectangular";
            textBox2.Text = "100";
            textBox3.Text = "100";
            textBox4.Text = "100";
            textBox5.Text = "0";
            textBox6.Text = "0";
            textBox7.Text = ".33";
            textBox8.Text = "2600";
            textBox9.Text = "530";
            textBox10.Text = "470";


        }
        // //////////////////////////////////////
        //
        // ABOUT FORM
        //
        // //////////////////////////////////////

        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            AboutBox1 aboutDialog = new AboutBox1();
            aboutDialog.ShowDialog();
        }

        // ////////////////////////////////////////
        // ////////////////////////////////////////
        //
        //
        // HELP
        //
        //
        // ////////////////////////////////////////
        // ////////////////////////////////////////
        private void helpToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            Help.ShowHelp(this, "c:\\myPrograms\\DYOR\\Reactor\\Reactor\\help\\HelpSWA.chm");
      
        }
        // ////////////////////////////////////////
        // ////////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////
        //
        // APPLICATION EXIT
        //
        //
        // //////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////
        private bool IsChangeOK()
        {
            // it's always OK to exit the program 
            // if nothing has changed 
            if (bTextChanged == false)
            {
                return true;
            }

            // but something has changed; check to see what the user
            // wants to do about it
            DialogResult dr = MessageBox.Show("Text changed. "
                + "Click OK to throw away changes.",
                "Text Modified",
                MessageBoxButtons.YesNo);
            return dr == DialogResult.Yes;
        }

        private void exitToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            // don't exit unless the data has been saved already
            // or the user says it's OK
            if (IsChangeOK() == false)
            {
                return;
            }
            // go ahead & bail out
            Application.Exit();
        }

        // //////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////
        //
        //  Text File I/O 
        //
        // //////////////////////////////////////
        // //////////////////////////////////////
        // //////////////////////////////////////

        private void newToolStripMenuItem_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage1;
            //
            // if the text has changed since the last save, ask first
            // before clearing the text
            if (textBox38.Modified == true)
            {
                string str;
                if (m_strFileName.Length > 0)
                {
                    str = m_strFileName;
                }
                else
                {
                    str = "The text in the edit control ";
                }
                str += " has changed. Do you want to save it?";
                if (MessageBox.Show(str, "TextChanged",
                    MessageBoxButtons.YesNo) == DialogResult.Yes)
                {

                    saveToolStripMenuItem_Click(sender, e);
                }
            }
            //
         
            // & set the modified flag to false
            textBox38.Modified = false;
            // Empty the file name
            m_strFileName = "";
           
        }

         private void openToolStripMenuItem_Click(object sender, EventArgs e)
            {
           
            openFileDialog2.FileName = m_strFileName;
            // Set the filter for text files
            openFileDialog2.Filter = MyFilterString;
            // Show the Read Only check box on the dialog box
            openFileDialog2.ShowReadOnly = true;
            // The default extension is for text files
            openFileDialog2.DefaultExt = ".txt";
            if (openFileDialog2.ShowDialog() ==
                DialogResult.Cancel)
            {
                return;
            }
            this.m_strFileName = openFileDialog1.FileName;
            FileStream strm;
            try
            {
                strm = new FileStream(m_strFileName,
                    FileMode.Open,
                    FileAccess.Read);
                StreamReader reader = new StreamReader(strm);
                textBox38.Text = reader.ReadToEnd();
                // Save the state of the read only box
                m_bReadOnly = openFileDialog1.ReadOnlyChecked;
                strm.Close();
                // Set the selection so the caret is at the top of the file
                textBox38.SelectionStart = 0;
                textBox38.SelectionLength = 0;
                // Adding text to the text box sets its Modified property to
                // true. The file has not actually been modified, so reset
                // the Modified property.
                textBox38.Modified = false;
             
            }
            // Catch the exception when the file cannot be found.
            catch (FileNotFoundException)
            {
                MessageBox.Show("Cannot open file", "Warning");
            }
            // Erase any text in the text box.
            tabControl1.SelectedTab = tabPage1;
        }
        private void saveToolStripMenuItem_Click(object sender, EventArgs e)

            {
            if (m_bReadOnly)
            {
                MessageBox.Show("File is open as Read-Only",
                    "Warning");
                return;
            }
            if (m_strFileName.Length == 0)
            {
                saveAsToolStripMenuItem_Click(sender, e);
                return;
            }
            if (textBox38.Modified == false)
            {
                return;
            }
            if (m_strFileName.Length == 0)
            {
                return;
            }
            FileStream strm;
            try
            {
                strm = new FileStream(m_strFileName,
                    FileMode.Open,
                    FileAccess.Write);
                StreamWriter writer = new StreamWriter(strm);
                writer.Write(textBox38.Text);
                writer.Flush();
                // Chop off any straggler text in the file.
                strm.SetLength(textBox38.Text.Length);
                strm.Close();
                textBox38.Modified = false;
            }
            catch (FileNotFoundException)
            {
                MessageBox.Show("Cannot open file", "Warning");
            }
            catch (NotSupportedException)
            {
                MessageBox.Show("Cannot write to file", "Warning");
            }
            catch (UnauthorizedAccessException)
            {
                MessageBox.Show("Not authorized to write to file",
                    "Warning");
            }
        }

        private void saveAsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (m_strFileName.Length > 0)
            {
                saveFileDialog2.FileName = m_strFileName;
            }
            if (saveFileDialog2.ShowDialog() ==
                DialogResult.Cancel)
            {
                return;
            }
            if (saveFileDialog2.FileName.Length == 0)
            {
                return;
            }
            string fn = saveFileDialog2.FileName;
            FileStream strm;
            try
            {
                strm = new FileStream(fn, FileMode.OpenOrCreate,
                    FileAccess.Write);
                StreamWriter writer = new StreamWriter(strm);
                writer.Write(textBox38.Text);
                writer.Flush();
                // Chop off any straggler text in the file.
                strm.SetLength(textBox38.Text.Length);
                strm.Close();
                textBox38.Modified = false;
                m_strFileName = fn;
             
            }
            catch (FileNotFoundException)
            {
                MessageBox.Show("Cannot open file", "Warning");
            }
            catch (NotSupportedException)
            {
                MessageBox.Show("Cannot write to file", "Warning");
            }
            catch (UnauthorizedAccessException)
            {
                MessageBox.Show("Not authorized to write to file",
                    "Warning");
            }
        }

        // /////////////////////////////
        // /////////////////////////////
        // /////////////////////////////
        //
        //   PRINT FEATURES
        //
        // /////////////////////////////
        // /////////////////////////////
        // /////////////////////////////
        void OnPrintPage(object sender, PrintPageEventArgs e)
        {
            // Create your own printer font in mnuFilePrint_Click()
            // or use the one in textBox1
            Font fontPrint = textBox38.Font;
            float linesPerPage = 0;
            float yPos = 0;
            int count = 0;
            float leftMargin = e.MarginBounds.Left;
            float topMargin = e.MarginBounds.Top;
            string line = null;
            // Declare some layout objects.
            // A SizeF structure to hold the size of the line
            SizeF size = new SizeF();
            // StringFormat to tell the MeasureString() method that
            // we want the line to break on a character
            StringFormat sf = new StringFormat();
            sf.Trimming = StringTrimming.Character;
            SizeF layout = new SizeF(-1, fontPrint.GetHeight());

            // Calculate the number of lines per page.
            linesPerPage = e.MarginBounds.Height /
                fontPrint.GetHeight(e.Graphics);
            // Print each line of the file.
            while (count < linesPerPage)
            {
                // Pick up any residual text from the previous page/line
                // that wouldn't fit on a line
                if (m_strRemaining.Length != 0)
                {
                    line = m_strRemaining;
                    m_strRemaining = "";
                }
                // if no residual text, get a new line.
                else
                {
                    if ((line = m_PrintReader.ReadLine()) == null)
                        break;
                    ExpandTabs(ref line);
                }
                // Calculate the y position on the page
                yPos = topMargin + (count *
                    fontPrint.GetHeight(e.Graphics));
                // Save the line in a temporary variable
                string first = line;
                // Measure the string in the selected font
                size = e.Graphics.MeasureString(first, fontPrint, layout, sf);
                int index = first.Length - 1;
                if (size.Width > e.MarginBounds.Width)
                {
                    // if there is no space in the line, break on a character
                    if (first.LastIndexOf(" ", first.Length - 1) < 0)
                    {
                        while (size.Width > e.MarginBounds.Width)
                        {
                            first = line.Substring(0, --index);
                            size = e.Graphics.MeasureString(first, fontPrint, layout, sf);
                        }
                    }
                    else
                    // Step back through the line word by word until it fits
                    {
                        while (size.Width > e.MarginBounds.Width)
                        {
                            index = first.LastIndexOf(" ", first.Length - 1);
                            first = line.Substring(0, index);
                            size = e.Graphics.MeasureString(first, fontPrint, layout, sf);
                        }
                        ++index;
                    }
                    // Save any remaining text
                    m_strRemaining = line.Substring(index);
                }
                // Draw the text on the page
                e.Graphics.DrawString(first, fontPrint, Brushes.Black,
                    leftMargin, yPos, new StringFormat());
                count++;
            }
            // Continue to the next page if the last line was not null.
            // Note: the PrintDocument.Print() method will issue a form feed
            // each time you return from this method with e.HasMorePages
            // set to true.
            if (line != null)
                e.HasMorePages = true;
            // Otherwise it is the end of the file as we know it.
            // Note: returning with e.HasMorePages set to false will
            // end the print job & send it to the spooler.
            else
                e.HasMorePages = false;
        }
        // Expand the tabs to eight spaces. This is the setting for
        // the text box control.

        byte[] StringToByte(string str)
        {
            byte[] b = new byte[str.Length];
            for (int x = 0; x < str.Length; ++x)
                b[x] = (byte)str[x];
            return (b);
        }
        void ExpandTabs(ref string text)
        {
            string str = text;
            int index = str.IndexOf('\t');
            if (index < 0)
                return;
            StringBuilder untabbed = new StringBuilder(str);
            do
            {
                int spaces = 8 - index % 8;
                untabbed.Remove(index, 1);
                untabbed.Insert(index, " ", spaces);
                str = untabbed.ToString();
                index = untabbed.ToString().IndexOf('\t');
            } while (index > 0);
            text = str;
        }
        //
        //
        private void pageupSetToolStripMenuItem_Click(object sender, EventArgs e)
          {

            // Create a byte stream just as you did for printing.
            byte[] bytestrm;
            bytestrm = StringToByte(textBox38.Text);
            MemoryStream strm = new MemoryStream(bytestrm);
            m_PrintReader = new StreamReader(strm);
            // This dialog box requires a PrintDocument.
            PrintDocument pd = new PrintDocument();
            // Get the current page settings.
            pd.DefaultPageSettings = m_PageSettings;
            // Add a preview controller. This displays the pages on the screen
            // as a series of images.
            pd.PrintController = new PreviewPrintController();
            // Use the OnPrintPage method as the page event handler
            pd.PrintPage += new PrintPageEventHandler
                (this.OnPrintPage);
            // Add the document to the dialog.
            printPreviewDialog1.Document = pd;
            // Show the dialog. Don't need to test for Cancel here.
            printPreviewDialog1.ShowDialog();
            // Dispose of the document & the byte array.
            pd.Dispose();
            bytestrm = null;
        }

        private void printToolStripMenuItem_Click(object sender, EventArgs e)
  {
            // Clone the PageSettings so change can be aborted.
            PageSettings pageSettings = (PageSettings)m_PageSettings.Clone();
            pageSetupDialog1.PageSettings = pageSettings;
            // To disable the printer button on the dialog, remove the following
            // two lines & the last line in this method.
            PrinterSettings printerSettings = (PrinterSettings)m_PrinterSettings.Clone();
            pageSetupDialog1.PrinterSettings = printerSettings;
            // Set the following property to false to disable the Printer button
            //			pageSetupDialog1.AllowPrinter = false;
            // if the user presses the Cancel button, don't save any changes.
            if (pageSetupDialog1.ShowDialog() == DialogResult.Cancel)
                return;
            // Save the new settings in the instance members.
            m_PageSettings = pageSettings;
            m_PrinterSettings = printerSettings;
        }
        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
          {
            if (textBox38.Text.Length == 0)
                return;
            byte[] bytestrm;
            try
            {
                PrintDocument pd = new PrintDocument();
                pd.PrinterSettings = (PrinterSettings)m_PrinterSettings.Clone();
                pd.DefaultPageSettings = (PageSettings)m_PageSettings.Clone();
                printDialog1.PrinterSettings = m_PrinterSettings;
                printDialog1.Document = pd;
                // if the text box contains selected text, enable the Selection box
                if (textBox1.SelectionLength > 0)
                    printDialog1.AllowSelection = true;
                else
                    printDialog1.AllowSelection = false;
                if (printDialog1.ShowDialog() == DialogResult.Cancel)
                    return;
                // if the PrintRange property of the printer settings is Selection,
                // get just the selected text in the text box.
                if (printDialog1.PrinterSettings.PrintRange == PrintRange.Selection)
                    bytestrm = StringToByte(textBox1.SelectedText);
                // Otherwise, get all of the text in the text box.
                else
                    bytestrm = StringToByte(textBox38.Text);
                // Create the stream.
                MemoryStream strm = new MemoryStream(bytestrm);
                m_PrintReader = new StreamReader(strm);
                try
                {
                    m_PrinterSettings = pd.PrinterSettings;
                    m_PageSettings = pd.DefaultPageSettings;
                    // The Document Name property is dispayed in the Windows apooler.
                    if (m_strFileName == "")
                        pd.DocumentName = "Untitled";
                    else
                        pd.DocumentName = m_strFileName;
                    pd.PrintPage += new PrintPageEventHandler
                        (this.OnPrintPage);
                    pd.Print();
                }
                finally
                {
                    m_PrintReader.Close();
                }
            }
            catch (Exception e2)
            {
                MessageBox.Show(e2.Message);
            }
            bytestrm = null;
        }

        // //////////////////////////////////////
        //
        //  EDITING CONTROL ELEMENTS
        //
        // //////////////////////////////////////
        private void WriteClipboard(string Text)
        {
            DataObject data = new DataObject();
            data.SetData(DataFormats.Text, Text);
            Clipboard.SetDataObject(data, true);
        }
        private string ReadClipboard()
        {
            // get whatever's on the clipboard
            IDataObject data = Clipboard.GetDataObject();
            if (data == null)
            {
                return null;
            }
            // get the data out, but make sure that's it
            object o = data.GetData(DataFormats.Text, true);
            if (o == null)
            {
                return null;
            }
            // OK, we got something; make absolutely sure
            // that it's a string
            if ((o is string) == false)
            {
                return null;
            }
            // that's it - we got something
            return (string)o;
        }
        // //////////////////////////////////////
        //
        // TOOLBAR
        //
        // //////////////////////////////////////
        private void cutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //
            // CUT
            //
            string Text = textBox1.SelectedText;
            WriteClipboard(Text);
            textBox1.SelectedText = "";
        }
        private void copyToolStripMenuItem_Click(object sender, EventArgs e)
         {
            //
            // COPY
            //
            string Text = textBox1.SelectedText;
            WriteClipboard(Text);
        }

        private void pasetToolStripMenuItem_Click(object sender, EventArgs e)
         {
            //
            // PASTE
            //
            String s = ReadClipboard();
            if (s != null)
            {
                textBox1.SelectedText = s;
            }
        }

        private void newToolStripButton_Click(object sender, EventArgs e)
        {
            newToolStripMenuItem_Click(sender, e);
     
        }

        private void openToolStripButton_Click(object sender, EventArgs e)
        {
            openToolStripMenuItem_Click(sender, e);
           
        }

        private void saveToolStripButton_Click(object sender, EventArgs e)
        {
            saveToolStripMenuItem_Click(sender, e);
 
        }

        private void printToolStripButton_Click(object sender, EventArgs e)
        {
            exitToolStripMenuItem_Click(sender, e);
        }

        private void cutToolStripButton_Click(object sender, EventArgs e)
        {
            cutToolStripMenuItem_Click(sender, e);
        }

        private void copyToolStripButton_Click(object sender, EventArgs e)
        {
            copyToolStripMenuItem_Click(sender, e);
         
        }

        private void pasteToolStripButton_Click(object sender, EventArgs e)
        {
           pasetToolStripMenuItem_Click( sender, e);
        
        }

        private void helpToolStripButton_Click(object sender, EventArgs e)
        {
            helpToolStripMenuItem1_Click(sender, e);
      
        }
        private void variablesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage2;

        }


        private void currentDesignToolStripMenuItem_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage6;
            // Reactor Results
            Calculation_Phase(); 



        }
        private void reactorToolStripMenuItem_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage3;
            // Reactor Results

        }

        private void primaryToolStripMenuItem_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage4;
            // Primary Results
  
        }

        private void secondaryToolStripMenuItem_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage5;
             // Second Output

        }
        private void toolStripButton1_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage6;
            // Reactor Results
            Calculation_Phase();
  

        }

        private void toolbarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            toolStrip1.Visible ^= true;
            toolbarToolStripMenuItem.Checked = toolStrip1.Visible;
        }

        private void statusBarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            statusStrip1.Visible ^= true;
            statusBarToolStripMenuItem.Checked = statusStrip1.Visible;	

        }

        // //////////////////////////////////////////////////
        //
        // Menu Select Design
        //
        // //////////////////////////////////////////////////

        private void uranium233ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namefuel = "U233";
            crossfiss = 514;
            crosscatf = 14;
            fcrossabs = 569;
            densityf = 19;
            Af = 233;
            thermalconduct = 14;

        }

        private void uranium235ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namefuel = "U235";
            crossfiss = 582;
            crosscatf = 15;
            fcrossabs = 679;
            densityf = 19;
            Af = 235;
            thermalconduct = 14;
        }

        private void plutonium239ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namefuel = "Pu239";
            crossfiss = 760;
            crosscatf = 11;
            fcrossabs = 1030;
            densityf = 19;
            Af = 239;
            thermalconduct = 14;
        }

        private void plutonium245ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namefuel = "Pu241";
            crossfiss = 988;
            crosscatf = 10;
            fcrossabs = 1384;
            densityf = 19;
            Af = 241;
            thermalconduct = 14;
        }

        private void americium242ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namefuel = "Am242";
            crossfiss = 6000;
            crosscatf = 12;
            fcrossabs = 7700;
            densityf = 19;
            Af = 242;
            thermalconduct = 14;
        }

        private void curium242ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namefuel = "Cm245";
            crossfiss = 1700;
            crosscatf = 20;
            fcrossabs = 2000;
            densityf = 19;
            Af = 245;
            thermalconduct = 14;
        }

  
        private void rectangularToolStripMenuItem_Click(object sender, EventArgs e)
        {
  
            label2.Text = "length";
            label3.Text = "width";
            label4.Text = "height";

            textBox1.Text = "Rectangular";
  
            tabControl1.SelectedTab = tabPage2;


        }
        private void cylindricalToolStripMenuItem_Click(object sender, EventArgs e)
        {

            label2.Text = "radius";
            label3.Text = "height";
            label4.Text = "";
            namegeo = "Cylindrical";
            textBox1.Text = "Cylindrical";
            tabControl1.SelectedTab = tabPage2;
        }

        private void sphericalToolStripMenuItem_Click(object sender, EventArgs e)
        {


            label2.Text = "radius";
            label3.Text = "";
            label4.Text = "";
            namegeo = "Spherical";
            textBox1.Text = "Spherical";
            tabControl1.SelectedTab = tabPage2;


        }
        private void btnUpdate_Click(object sender, EventArgs e)
        {

            try
            {
                if (IsValidData())
                {
                    switch (namegeo)
                    {
                        case "Rectangular":
                            {
                                Double LX = Convert.ToDouble(textBox2.Text);
                                Double LY = Convert.ToDouble(textBox3.Text);
                                Double LZ = Convert.ToDouble(textBox4.Text);

                                label2.Text = "length";
                                label3.Text = "width";
                                label4.Text = "height";
                                namegeo = "Rectangular";
                                Volume = (LX * LY * LZ) / (1000000);
                                Buckling = (pi / LX) * (pi / LX) + (pi / LY) * (pi / LY) + (pi / LZ) * (pi / LZ);
                                tubelength = LX;
                                textBox1.Text = "Rectangular";
                                textBox11.Text = Volume.ToString("f2");
                                tabControl1.SelectedTab = tabPage2;
                            }
                            break;
                        case "Cylindrical":
                            {
                                Double cr = Convert.ToDouble(textBox2.Text);
                                Double cheight = Convert.ToDouble(textBox3.Text);
                                label2.Text = "radius";
                                label3.Text = "height";
                                label4.Text = "";
                                namegeo = "Cylindrical";
                                textBox1.Text = "Cylindrical";
                                Volume = (pi * (cr * cr) * cheight) / (1000000);
                                tubelength = cr;
                                Buckling = (2.405 / cr) * (2.405 / cr) + (pi / cheight) * (pi / cheight);

                                textBox11.Text = Volume.ToString("f2");
                                tabControl1.SelectedTab = tabPage2;
                            }
                            break;

                        case "Spherical":
                            {
                                Double r = Convert.ToDouble(textBox2.Text);

                                label2.Text = "radius";
                                label3.Text = "";
                                label4.Text = "";
                                namegeo = "Spherical";
                                textBox1.Text = "Spherical";
                                tabControl1.SelectedTab = tabPage2;
                                Volume = (1.33 * pi * r * r * r) / (1000000);
                                Buckling = (pi / r) * (pi / r);
                                tubelength = r;
                                textBox11.Text = Volume.ToString("f2");
                                tabControl1.SelectedTab = tabPage2;
                            }
                            break;
                    }
                    Double xnumbertubes = Convert.ToDouble(textBox6.Text);
                    Double xporosity = Convert.ToDouble(textBox7.Text);
                    Double xvelocity = Convert.ToDouble(textBox8.Text);
                    Double xmaxtemp = Convert.ToDouble(textBox9.Text);
                    Double xmintemp = Convert.ToDouble(textBox10.Text);

                    numbertubes = xnumbertubes;
                    velocity = xvelocity;
                    porosity = xporosity;
                    maxtemp = xmaxtemp;
                    mintemp = xmintemp;
                }
            }

            catch (FormatException)
            {
                MessageBox.Show(
                    "Invalid numeric format. Please check all entries.",
                    "Entry Error");
            }
            catch (OverflowException)
            {
                MessageBox.Show(
                    "Overflow error. Please enter smaller values.",
                    "Entry Error");
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    ex.Message + "\n\n" +
                    ex.GetType().ToString() + "\n" +
                    ex.StackTrace, "Exception");
            }
        }
         

        public bool IsValidData()
        {
            return
             // Validate  text box
                IsPresent(textBox2, "") &&
                IsDouble(textBox2, "") &&
                IsWithinRange(textBox2, "", 0, 1000) &&

             // Validate  text box
                IsPresent(textBox3, "") &&
                IsDouble(textBox3, "") &&
                IsWithinRange(textBox3, "", 0, 1000) &&

             // Validate  text box
                IsPresent(textBox4, "") &&
                IsDouble(textBox4, "N") &&
                IsWithinRange(textBox4, "", 0, 1000) &&
            
             // Validate  text box
                IsPresent(textBox5, "") &&
                IsDouble(textBox5, "") &&
                IsWithinRange(textBox5, "", 0, 1000) &&

             // Validate  text box
                IsPresent(textBox6, "") &&
                IsDouble(textBox6, "") &&
                IsWithinRange(textBox6, "", 0, 20) &&

             // Validate  text box
                IsPresent(textBox7, "") &&
                IsDouble(textBox7, "N") &&
                IsWithinRange(textBox7, "", 0, 1) &&

             // Validate  text box
                IsPresent(textBox8, "") &&
                IsDouble(textBox8, "") &&
                IsWithinRange(textBox8, "", 0, 5000) &&

             // Validate  text box
                IsPresent(textBox9, "") &&
                IsDouble(textBox9, "") &&
                IsWithinRange(textBox9, "", 100, 1000) &&

             // Validate  text box
                IsPresent(textBox10, "") &&
                IsDouble(textBox10, "") &&
                IsWithinRange(textBox10, "", 100, 1000);
        }
        // ////////////////////////////////
        //
        // Validate Input
        //
        // ////////////////////////////////

        public bool IsPresent(TextBox textBox, string name)
        {
            if (textBox.Text == "")
            {
                MessageBox.Show(name + " is a required field.", "Entry Error");
                textBox.Focus();
                return false;
            }
            return true;
        }

        public bool IsDouble(TextBox textBox, string name)
        {
            try
            {
                Convert.ToDouble(textBox.Text);
                return true;
            }
            catch (FormatException)
            {
                MessageBox.Show(name + " must be a decimal value.", "Entry Error");
                textBox.Focus();
                return false;
            }
        }

        public bool IsInt32(TextBox textBox, string name)
        {
            try
            {
                Convert.ToInt32(textBox.Text);
                return true;
            }
            catch (FormatException)
            {
                MessageBox.Show(name + " must be an integer.", "Entry Error");
                textBox.Focus();
                return false;
            }
        }

        public bool IsWithinRange(TextBox textBox, string name,
            decimal min, decimal max)
        {
            decimal number = Convert.ToDecimal(textBox.Text);
            if (number < min || number > max)
            {
                MessageBox.Show(name + " must be between " + min.ToString()
                    + " and " + max.ToString() + ".", "Entry Error");
                textBox.Focus();
                return false;
            }
            return true;
        }
        // /////////////////////////
        private void inputToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            tabControl1.SelectedTab = tabPage2;
        }

        private void waterToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namemod = "H2O";
            diffus = 7.617;
            fermi = 31.36;
            densitym = 1;
            mcrossabs = .66;
            Am = 18;
        }

        private void heavyWaterToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namemod = "D2O";
            diffus = 10000;
            fermi = 121;
            densitym = 1.1;
            mcrossabs = .002;
            Am = 20;
        }
        private void beryliumToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namemod = "Be";
            diffus = 441;
            fermi = 84.64;
            densitym = 1.85;
            mcrossabs = .01;
            Am = 9;
        }
        private void sodiumToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namemod = "Na";
            diffus = 1;
            fermi = 1;
            densitym = 1;
            mcrossabs = 1;
            Am = 11;
        }

        private void carbon12ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namemod = "C12";
            diffus = 4121;
            fermi = 350;
            densitym = 1.9;
            mcrossabs = .004;
            Am = 12;
        }

        private void carbon14ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namemod = "C13";
            diffus = 4121;
            fermi = 350;
            densitym = 1.9;
            mcrossabs = .002;
            Am = 13;
        }

        private void waterToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            namecool1 = "H2O";
            namecool2 = "H2O";
            
        }

        private void hydrogenToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namecool1 = "hydrogen";
            namecool2 = ""; 
            hydrogen();
        }

        private void heliumToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namecool1 = "helium";
            namecool2 = "H2O"; 
            helium();
        }

        private void sodiumWaterToolStripMenuItem_Click(object sender, EventArgs e)
        {
            namecool1 = "sodium";
            namecool2 = "sodium"; 
            sodium();
        }

//*******************************************************************
// ///////////////////////////////////////
// ///////////////////////////////////////
// ///////////////////////////////////////
//
// CALCULATIONS
//
// ///////////////////////////////////////
// ///////////////////////////////////////
// ///////////////////////////////////////
//*******************************************************************  
       
         private void Cal_Number_Tubes()
            {
                heatvolume = porosity * Volume * (1000000);
                tubevolume = ((tubedia * tubedia) / 4) * pi * tubelength;
                numbertubes = (heatvolume / tubevolume);
            }
            //*******************************************************************
        private void Cal_Coolant()
        {
            //'{This  does all remaining power }
            //'{conversion calculations}

            switch (namecool1)
            {
                case "H2O":
                    {
                        water();
                        ccrossabs = .66;
                        velocity = (10 * (flowrate) )/ (densityc * numbertubes * (tubedia * tubedia / 4) * pi);
                    }
                    break;

                case "D2O":
                    {
                        water();
                        ccrossabs = .001;
                        velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi);
                    }
                    break;

                case "H":
                    {
                        hydrogen();
                        velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi);
                        Pressurec = 1;
                        ccrossabs = .33;
                        //'{1/3 of Mach 1};
                        Maxvelh2 = (Math.Sqrt((1.4 * 8315 * maxtemp) / 2)) / 3;
                        if (velocity > Maxvelh2)
                        {

                            velx = velocity / Maxvelh2;
                            Pressurec = Pressurec * 2 * velx;
                            velocity = Maxvelh2;
                        }
                    }
                    break;
            case "He":
                {

                    helium();
                    velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi);
                    Pressurec = 1;
                    ccrossabs = .007;
                    MaxVelHe = (Math.Sqrt((1.66 * 8315 * maxtemp) / 8)) / 3;
                    if (velocity > MaxVelHe)
                    {
                        MaxVelHe = 1;
                        // change this when fix above
                        velx = velocity / MaxVelHe;
                        Pressurec = Pressurec * 2 * velx;
                        velocity = MaxVelHe;
                    }
                }
                break;
                case "Sodium":
                    {

                        sodium();
                        velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi);
                        Pressurec = 1;
                        ccrossabs = .525;
                    }
                    break;
            }

        }
        //*******************************************************************
        private void Cal_Rx_Pressure_Drop()
        {
            //'{R_ Uses English units, smooth pipe, turbulent flow}
            // ' {Incompressible fluid, no height, no acceleration contribution}
            gc = 9.8;

            R_velocity = velocity * 11880;
            R_densityc = densityc / .016;
            R_tubedia = tubedia / 30.48;
            Reynolds_Number = (R_velocity * R_densityc * R_tubedia) / viscosity;
            friction_factor = (.079) / ((Math.Sqrt(Reynolds_Number)));
            term_pd1 = 1.5 * 4 * friction_factor * (tubelength / tubedia);
            Rx_Pressure_Drop = (term_pd1 * densityc * 100 * velocity * velocity) / (2 * gc * 1034);
        }
        //*******************************************************************
        private void Cal_Primary_Pressure()
        {
            //' {atmos.}
            Pri_Pressure = Pressurec - Rx_Pressure_Drop;
            if (Pri_Pressure < 0)
            {
                Pri_Pressure = 1;
            }
            else
                Pri_Pressure = 45;
        }//*******************************************************************
        private void Cal_Pri_Pump_Power()
        {
            //' {Megawatts}

            double Pump_Effic = .8;
            Pump_Power = Pump_Effic * Rx_Pressure_Drop * (pi * tubedia * tubedia / 4) * numbertubes * velocity * .00001;
            Pump_Power = 1;
        }
        //*******************************************************************
    private void Cal_Power_Density ()
    {
    //'   {MW}
      DeltaT = (maxtemp - mintemp);
      powerth = heatcap * (maxtemp - mintemp) * flowrate / (1000000);
      AdjVol = Volume * (1 - porosity);
      Powerdensity = powerth / AdjVol;
}
        //*******************************************************************
        private void Cal_Fuel_Temperature()
        {
         //'  { degrees Kelvin}
         FuelR = ((1 / (1 - porosity)) * tubedia / 2);
         if (FuelR < .4)
         {
           FuelR = .4;
            }
        }
        //*******************************************************************
        private void Cal_Mass()
        {
            //'             {MegaGrams}

            massm = densitym * AdjVol;
            massc = densityc * (Volume * porosity);
        }
        //*******************************************************************
        private void Cal_Heat_Flux()
        {
            tubearea = (pi * tubedia * tubelength * numbertubes);
            heatflux = (powerth * 1000000) / (tubearea);
        }
        //*******************************************************************
        private void Cal_Critical_Mass()
        {

            //'  {This  does the criticality analysis}
            double Neta = 2.06;
            double Avagodro_Number = 6.06e+23;
            double crit;
            double a;
            double b;
            double factor;
            double terma;
            double termb;
            double termi;

            a = fcrossabs;
            factor = massm / (massc + massm);
            b = ((factor * mcrossabs) + (1 - factor) * ccrossabs);
            termi = (-Buckling * fermi);
            //' If (termi > -37.5) And (termi < 37.5) Then
            terma = (Neta * Math.Exp(termi)) - 1;
            //'  Else
            //' End If
            //' terma = -1
            termb = (1 + diffus * Buckling);
            ratio = (terma * a) / (termb * b);
            Nm = (densitym * Avagodro_Number) / Am;
            Nf = Nm / ratio;
            CritMass = Volume * (Af / Am) * (densitym / ratio) * (1000);

            if (CritMass < 0)
            {
                CritMass = .0001;
                Warning();
            }
        }
        //*******************************************************************
        private void Cal_Specific_power()
        {
            //'   {kw/g}
            SpecificPower = (powerth) / (CritMass);
        }
        //*******************************************************************
        private void Cal_Neutron_Flux()
        {
            N_Flux = (powerth * 3.1 * Math.Pow(10, 10)) / (Volume * Nf * crossfiss * barn);
        }
    //*******************************************************************
    private void Cal_Sec_Flowrate ()
    {
    //' {kg/sec}
    Term1 = (Sec_Enthalpy[0] - Sec_Enthalpy[3]) * conventhalpyc;
    Sec_Flowrate = (powerth * 1000) / (Term1);
    }
    //*******************************************************************
    private void Cal_Sec_Turbine_Power ()
    {
    //'     {Megawatts}
    switch (namecool1)
    {
        case "H2":
            {
                Term1 = (Sec_Enthalpy[0] - Sec_Enthalpy[1]) * conventhalpyc * 1000;
                Turbine_Power = Sec_Flowrate * Term1 * .000001;
            }
            break;

        case "Sodium":
            {
                sodium();
                velocity = 10 * (flowrate) / (densityc * numbertubes * (tubedia * tubedia / 4) * pi);
                Pressurec = 1;
                ccrossabs = .525;
            }
            break;
    }
        Turbine_Power = flowrate * heatcap * (maxtemp - mintemp) * (.36) * (.000001);
    }
    //*******************************************************************
    private void Cal_Sec_Condensate_Pump()
    {
    //'    {Megawatts}
    Term1 = (Sec_Enthalpy[3] - Sec_Enthalpy[2]) * conventhalpyc * 1000;
    Cond_Pump_Power = Sec_Flowrate * flowrate * .000001;
    }
    //*******************************************************************
    private void Cal_Sys_Efficiency ()
    {
    Effic = (100) * (Turbine_Power / powerth);
    }
        //*******************************************************************
        //*******************************************************************
        //*******************************************************************
        // 
        //   CALCULATIONS PHASE
        //
        //*******************************************************************
        //*******************************************************************
        //*******************************************************************
       private void Calculation_Phase()
        {
            Cal_Number_Tubes();
            Cal_Coolant();
            Cal_Rx_Pressure_Drop();
            Cal_Primary_Pressure();
            Cal_Pri_Pump_Power();
            Cal_Power_Density();
            Cal_Fuel_Temperature();
            Cal_Mass();
            Cal_Heat_Flux();
            Cal_Critical_Mass();
            Cal_Specific_power();
            Cal_Neutron_Flux();
            Cal_Sec_Flowrate();
            Cal_Sec_Turbine_Power();
            Cal_Sec_Condensate_Pump();
            Cal_Sys_Efficiency();

            // ////////////////
            // OUTPUT
            // ///////////////
            // Reactor Design
            textBox41.Text = namefuel;
            textBox42.Text = namemod;
            textBox43.Text = namecool1;
            textBox44.Text = namecool2;
            textBox45.Text = namegeo;
            textBox46.Text = tubedia.ToString("f2");
            textBox47.Text = porosity.ToString("f2");
            textBox48.Text = flowrate.ToString("f2");
            textBox49.Text = mintemp.ToString("f2");
            textBox50.Text = maxtemp.ToString("f2");
            // Reactor Results
     
            textBox11.Text = Volume.ToString("f2");
            textBox12.Text = Buckling.ToString("e2");
            textBox13.Text = ratio.ToString("f2");
            textBox14.Text = Nf.ToString("e2");
            textBox15.Text = massm.ToString("f2");
            textBox16.Text = CritMass.ToString("f2");
            textBox17.Text = heatflux.ToString("f2");
            textBox18.Text = SpecificPower.ToString("f2");
            textBox19.Text = N_Flux.ToString("e2");
            textBox20.Text = powerth.ToString("f2");
            // Primary Output
            textBox21.Text = porosity.ToString("f2");
            textBox22.Text = tubedia.ToString("f2");
            textBox23.Text = numbertubes.ToString("f2");
            textBox24.Text = Pri_Pressure.ToString("f2");
            textBox25.Text = flowrate.ToString("f2");
            textBox26.Text = velocity.ToString("f2");
            textBox27.Text = Pump_Power.ToString("f2");
            textBox28.Text = massc.ToString("f2");
            textBox29.Text = maxtemp.ToString("f2");
            textBox30.Text = DeltaT.ToString("f2");
            // Second Output
            textBox31.Text = Sec_Temperature[0].ToString("f2");
            textBox32.Text = Sec_Pressure[3].ToString("f2");
            textBox33.Text = Convert.ToString("80");
            textBox34.Text = Effic.ToString("f2");
            textBox35.Text = Cond_Pump_Power.ToString("f2");
            textBox36.Text = Sec_Flowrate.ToString("f2");
            textBox37.Text = Turbine_Power.ToString("f2");
            textBox38.Text = " REACTOR DESIGN " + "\n\n" 
                + textBox41.Text + " " + textBox42.Text + " " + textBox43.Text + " " + textBox44.Text + " "
                + textBox45.Text + " " + textBox46.Text + " " + textBox47.Text + " " + textBox48.Text + " " + textBox49.Text + " "
                + textBox50.Text + "\n\n"
                + " Reactor Results " + "\n\n" 
                + textBox11.Text + " " + textBox12.Text + " " + textBox13.Text + " " + textBox14.Text + " "
                + textBox15.Text + " " + textBox16.Text + " " + textBox17.Text + " " + textBox18.Text + " " + textBox19.Text + " "
                + textBox20.Text + "" + "\n\n"
                + " Primary Results " + "\n\n" 
                + textBox21.Text + " " + textBox22.Text + " " + textBox23.Text + " " + textBox24.Text + " "
                + textBox25.Text + " " + textBox26.Text + " " + textBox27.Text + " " + textBox28.Text + " " + textBox29.Text + " "
                + textBox30.Text + "" + "\n\n"
                + " Secondary Results " + "\n\n" 
                + textBox31.Text + " " + textBox32.Text + " " + textBox23.Text + " " + textBox34.Text + " "
                + textBox35.Text + " " + textBox36.Text + " " + textBox37.Text;


            string xtextBox51 = Convert.ToString(textBox39.Text) + Convert.ToString(textBox40.Text);
            textBox51.Text = Convert.ToString(xtextBox51);
        }
 //*******************************************************************
 //*******************************************************************
 // 
// DATA
//
//*******************************************************************
//*******************************************************************
 private void helium()
    {

     heatcap = 1.242 * convheatcap;

    if (mintemp <= 60) 
    {
    densityc = .0915;
    }
    if ((mintemp > 60) & (mintemp <= 100)) 
     {
    densityc = .211;
     }
    if ((mintemp > 100) & (mintemp <= 150))
     {
    densityc = .0152;
     }
    if ((mintemp > 150) & (mintemp <= 200))
     {
    densityc = .0119;
     }
    if ((mintemp > 200) & (mintemp <= 353))
     {
    densityc = .0083;
     }
    if ((mintemp > 353) & (mintemp <= 593))
     {
    densityc = .00517;
     }
    if ((mintemp > 593) & (mintemp <= 920)) 
     {
    densityc = .00376;
     }
    if (mintemp > 920) 
    {
    densityc = .0033;
     }
     densityc = densityc * convdensityc;
    if (mintemp <= 400) 
    {
    viscosity = .045;
     }
     if ((mintemp > 400) & (mintemp <= 800))
     {
    viscosity = .06;
     }
    if (mintemp > 800)
    {
    viscosity = .09;
     }
        }
    private void hydrogen()
        {
    if (mintemp <= 30) {
    
       heatcap1 = 2.589;
       densityc = .052;
    }
    if ((mintemp > 30) & (mintemp <= 50))
     {
      
       heatcap1 = 2.508;
       densityc = .031;
    }
    if ((mintemp > 50) & (mintemp <= 100)) 
     {
       heatcap1 = 2.682;
       densityc = .015;
    }
    if ((mintemp > 100) & (mintemp <= 150) )
     {
      
       heatcap1 = 3.101;
       densityc = .01;
     }
    if ((mintemp > 150) & (mintemp <= 200) )
     {
      
       heatcap1 = 3.234;
       densityc = .0076;
     }
    if ((mintemp > 200) & (mintemp <= 250)) 
     {
      
       heatcap1 = 3.358;
       densityc = .00613;
     }
    if ((mintemp > 250) & (mintemp <= 300))
     {
      
       heatcap1 = 3.419;
       densityc = .0055;
     }
    if ((mintemp > 300) & (mintemp <= 350))
     {
      
       heatcap1 = 3.448;
       densityc = .0051;
     }
    if ((mintemp > 350) & (mintemp <= 400) )
     {
      
       heatcap1 = 3.461;
       densityc = .0044;
     }
    if ((mintemp > 400) & (mintemp <= 450)) 
     {
      
       heatcap1 = 3.463;
       densityc = .0038;
    }
    if ((mintemp > 450) & (mintemp <= 500) )
     {
      
       heatcap1 = 3.465;
       densityc = .0034;
     }
    if ((mintemp > 500) & (mintemp <= 550)) 
     {
      
       heatcap1 = 3.471;
       densityc = .00307;
      }
    if ((mintemp > 550) & (mintemp <= 600))
     {
      
       heatcap1 = 3.47;
       densityc = .00279;
     }
    if ((mintemp > 600) & (mintemp <= 700))
     {
      
       heatcap1 = 3.481;
       densityc = .00255;
     }
    if ((mintemp > 700) & (mintemp <= 800))
     {
      
       heatcap1 = 3.505;
       densityc = .00218;
     }
    if ((mintemp > 800) & (mintemp <= 900))
     {
      
       heatcap1 = 3.54;
       densityc = .0019;
      }
    if ((mintemp > 900) & (mintemp <= 1000))
     {
      
       heatcap1 = 3.575;
       densityc = .0017;
     }
    if ((mintemp > 1000) & (mintemp <= 1100))
     {
      
       heatcap1 = 3.622;
       densityc = .0015;
      }
    if ((mintemp > 1100) & (mintemp <= 1200) )
            {
    
       heatcap1 = 3.67;
       densityc = .00139;
     }
     if ((mintemp > 1200) & (mintemp <= 1300))
     {
      
       heatcap1 = 3.72;
       densityc = .00128;
       }
    if (mintemp > 1300) 
    {
      
       heatcap1 = 3.735;
       densityc = .00118;
    }
   // heatcap = heatcap1 * convheatcap;
   // densityc = densityc * convdensityc;
    viscosity = .022;
 }
        private void sodium()
 {
    if ((mintemp > 300) & (mintemp <= 373)) 
     {
      
       heatcap1 = .3305;
       densityc = 57.87;
       viscosity = 2;
      }
    if ((mintemp > 373) & (mintemp <= 473)) 
     {
      
       heatcap1 = .32;
       densityc = 56.44;
       viscosity = 1.7;
      }
    if ((mintemp > 473) & (mintemp <= 573) )
     {
      
       heatcap1 = .3116;
       densityc = 55.06;
       viscosity = 1.089;
      }
    if ((mintemp > 573) & (mintemp <= 673))
     {
  
       heatcap1 = .3055;
       densityc = 53.63;
       viscosity = .835;
      }
    if ((mintemp > 673) & (mintemp <= 773) )
     {
      
       heatcap1 = .3015;
       densityc = 52.07;
       viscosity = .687;
      }
    if ((mintemp > 773) & (mintemp <= 873)) 
     {
      
       heatcap1 = .2998;
       densityc = 50.51;
       viscosity = .587;
      }

    if ((mintemp > 873) & (mintemp <= 973)) 
     {
      
       heatcap1 = .3003;
       densityc = 48.48;
       viscosity = .508;
      }
    if ((mintemp > 973) & (mintemp <= 1073)) 
     {
      
       heatcap1 = .303;
       densityc = 47.26;
       viscosity = .45;
      }
      if ((mintemp > 1073) & (mintemp <= 1173)) 
     {
      
       heatcap1 = .3079;
       densityc = 46.5;
       viscosity = .39;
      }
    if (mintemp > 1173) 
     {
      
       heatcap1 = .3;
       densityc = 45;
       viscosity = .362;
      }
      heatcap = heatcap1 * convheatcap;
      densityc = densityc * convdensityc;

       }
        private void Warning()
        {
            MessageBox.Show("Criticality Failure", "Warning");
        }
        private void water()

    {
    if (mintemp <= 273)
    {
               enthalpyc = .01;
               viscosity = 4.32;

               heatcap1 = 1;
               Pressurec = .0235;
               densityc = 62.57;
    }
    if ((mintemp > 273) & (mintemp <= 293)) 
{
            
               enthalpyc = 36.09;
               viscosity = 4.32;
               heatcap1 = 1.0074;
               Pressurec = .0728;
               densityc = 62.46;
}
    if ((mintemp > 293) & (mintemp <= 313))
{
            
              enthalpyc = 72.04;
              viscosity = 3.1;
              heatcap1 = .9988;
              Pressurec = .199;
              densityc = 62.09;
}
    if ((mintemp > 313) & (mintemp <= 333)) 
{
            
              enthalpyc = 108.9;
              viscosity = 1.61;
              heatcap1 = .998;
              Pressurec = .47;
              densityc = 61.52;
}
    if ((mintemp > 333) & (mintemp <= 353)) 
{
            
              enthalpyc = 143.9;
              viscosity = 1.05;
              heatcap1 = .9994;
              Pressurec = 1;
              densityc = 60.81;
}
if ((mintemp > 353) & (mintemp <= 373)) 
{
    
              enthalpyc = 180.1;
              viscosity = .74;
              heatcap1 = 1.002;
              Pressurec = 1.958;
              densityc = 59.97;
}
    if ((mintemp > 373) & (mintemp <= 393)) 
{
            
              enthalpyc = 216.5;
              viscosity = .6;
              heatcap1 = 1.007;
              Pressurec = 3.565;
              densityc = 59.01;
}
    if ((mintemp > 393) & (mintemp <= 413)) 
{
            
              enthalpyc = 253.3;
              viscosity = .5;
              heatcap1 = 1.015;
              Pressurec = 6.27;
              densityc = 57.95;
}
    if ((mintemp > 413) & (mintemp <= 433))
{
    
              enthalpyc = 292.1;
              viscosity = .4;
              heatcap1 = 1.023;
              Pressurec = 9.86;
              densityc = 56.79;
}

    if ((mintemp > 433) & (mintemp <= 453))
{
    
              enthalpyc = 328;
              viscosity = .3;
              heatcap1 = 1.037;
              Pressurec = 15.305;
              densityc = 55.5;
}
   if ((mintemp > 453) & (mintemp <= 473))
{

              enthalpyc = 366.4;
              viscosity = .25;
              densityc = 54.11;
              heatcap1 = 1.05;
              Pressurec = 23.3;
}
    if ((mintemp > 473) & (mintemp <= 493))
{
            
              enthalpyc = 413;
              viscosity = .2;
              heatcap1 = 1.076;
              Pressurec = 33.3;
              densityc = 52.59;
}
    if ((mintemp > 493) & (mintemp <= 513)) 
{
            
              enthalpyc = 447;
              viscosity = .16;
               heatcap1 = 1.101;
              Pressurec = 46.24;
              densityc = 50.92;
}
    if ((mintemp > 513) & (mintemp <= 533) )
{
            
              enthalpyc = 487;
              viscosity = .16;
              heatcap1 = 1.136;
              Pressurec = 62.7;
              densityc = 49.02;

}
    if ((mintemp > 533) & (mintemp <= 553))
{
            
              enthalpyc = 530;
              viscosity = .16;
              heatcap1 = 1.182;
              Pressurec = 83.3;
              densityc = 46.98;
}
    if ((mintemp > 553) & (mintemp <= 573)) 
    {
            
              enthalpyc = 575;
              viscosity = .16;
              heatcap1 = 1.244;
              Pressurec = 111.56;
              densityc = 44.59;
    }
    if ((mintemp > 573) & (mintemp <= 593))
    {
            
              enthalpyc = 631;
              viscosity = .16;
              heatcap1 = 1.368;
              Pressurec = 144.21;
              densityc = 43;
    }
    if (mintemp > 593) 
    {
            
              enthalpyc = 687;
              viscosity = .16;
              heatcap1 = 1.3;
              Pressurec = 184;
              densityc = 42;
    }
         heatcap = heatcap1 * convheatcap;
         Pressurec = Pressurec * safetyfactor;
         densityc = densityc * convdensityc;
         enthalpyc = enthalpyc * conventhalpyc;

    }

        private void waterBindingNavigatorSaveItem_Click(object sender, EventArgs e)
        {
            this.Validate();
            this.waterBindingSource.EndEdit();


        }

        private void FrmMain_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'reactor1DataSet.water' table. You can move, or remove it, as needed.
            this.waterTableAdapter.Fill(this.reactor1DataSet.water);
            // TODO: This line of code loads data into the 'dYORdb1DataSet.water' table. You can move, or remove it, as needed.
            // TODO: This line of code loads data into the 'reactor1DataSet.water' table. You can move, or remove it, as needed.
            this.waterTableAdapter.Fill(this.reactor1DataSet.water);
            // TODO: This line of code loads data into the 'reactor1DataSet.water' table. You can move, or remove it, as needed.
       }

        // ////////////////////////////////
        //
        // Click & Drag
        //
        // ////////////////////////////////


        private void btnU235_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            fuel = true;
            mod = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            uranium235ToolStripMenuItem_Click(sender, e);
        }
        private void btnU233_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            fuel = true;
            mod = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            uranium233ToolStripMenuItem_Click(sender, e);
        }
        private void btnPu239_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            fuel = true;
            mod = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            plutonium239ToolStripMenuItem_Click(sender, e);
        }
        private void btnPu241_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            fuel = true;
            mod = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            plutonium245ToolStripMenuItem_Click(sender, e);
        }
        private void btnCm242_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            fuel = true;
            mod = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            curium242ToolStripMenuItem_Click(sender, e);
        }
        private void btnAm245_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            fuel = true;
            mod = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            americium242ToolStripMenuItem_Click(sender, e);
        }
        private void btnH2OMouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = true;
            fuel = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            waterToolStripMenuItem_Click(sender, e);
        }
        private void btnD2O_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = true;
            fuel = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            heavyWaterToolStripMenuItem_Click(sender, e);
        }
        private void btnBe_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = true;
            fuel = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            beryliumToolStripMenuItem_Click(sender, e);
        }
        private void btnNa_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = true;
            fuel = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            sodiumWaterToolStripMenuItem_Click(sender, e);
        }
        private void btnC12_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = true;
            fuel = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            carbon12ToolStripMenuItem_Click(sender, e);
        }
        private void btnC13_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = true;
            fuel = false;
            cool = false; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            carbon14ToolStripMenuItem_Click(sender, e);
        }
        private void btnH2OCool_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = false;
            fuel = false;
            cool = true; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            waterToolStripMenuItem_Click(sender, e);
        }
        private void btnHe_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = false;
            fuel = false;
            cool = true; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            heliumToolStripMenuItem_Click(sender, e); 
        }
        private void btnH2_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = false;
            fuel = false;
            cool = true; 
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            hydrogenToolStripMenuItem_Click(sender, e);
        }
        private void btnNaCool_MouseDown(object sender, MouseEventArgs e)
        {
            Button source = (Button)sender;
            mod = false;
            fuel = false;
            cool = true;
            DoDragDrop(source.BackgroundImage, DragDropEffects.Copy);
            sodiumWaterToolStripMenuItem_Click(sender, e);
        }
        private void panel_DragEnter(object sender, DragEventArgs e)
        {

            //As we are interested in Image data only we will check this as follows
            if (e.Data.GetDataPresent(typeof(Bitmap)))
            {
                e.Effect = DragDropEffects.Copy;
            }
            else
            {
                e.Effect = DragDropEffects.None;
            }
      
        }
        private void panel_DragDrop(object sender, DragEventArgs e)
        {
           //target control will accept data here 
            Panel destination = (Panel)sender;
            destination.BackgroundImage = (Bitmap)e.Data.GetData(typeof(Bitmap));



        }
        private void panel17_DragEnter(object sender, DragEventArgs e)
        {

            //As we are interested in Image data only we will check this as follows
            if (e.Data.GetDataPresent(typeof(Bitmap)) & fuel)
            {
                e.Effect = DragDropEffects.Copy;
            }
            else
            {
                e.Effect = DragDropEffects.None;
            }
            fuel = false;

        }
        private void panel38_DragEnter(object sender, DragEventArgs e)
        {

            //As we are interested in Image data only we will check this as follows
            if (e.Data.GetDataPresent(typeof(Bitmap)) & mod)
            {
                e.Effect = DragDropEffects.Copy;
            }
            else
            {
                e.Effect = DragDropEffects.None;
            }
            mod = false;

        }
        private void panel33_DragEnter(object sender, DragEventArgs e)
        {

            //As we are interested in Image data only we will check this as follows
            if (e.Data.GetDataPresent(typeof(Bitmap)) & cool)
            {
                e.Effect = DragDropEffects.Copy;
            }
            else
            {
                e.Effect = DragDropEffects.None;
            }
            cool = false;

        }

        private void waterBindingNavigatorSaveItem_Click_1(object sender, EventArgs e)
        {
            this.Validate();
            this.waterBindingSource.EndEdit();


        }

        private void waterBindingNavigatorSaveItem_Click_2(object sender, EventArgs e)
        {
            this.Validate();
            this.waterBindingSource.EndEdit();
            this.waterTableAdapter.Update(this.reactor1DataSet.water);

        }

        private void waterBindingNavigatorSaveItem_Click_3(object sender, EventArgs e)
        {
            this.Validate();
            this.waterBindingSource.EndEdit();

        }

        private void waterBindingNavigatorSaveItem_Click_4(object sender, EventArgs e)
        {
            this.Validate();
            this.waterBindingSource.EndEdit();
            this.waterTableAdapter.Update(this.reactor1DataSet.water);

        }

        private void bntFileSave_Click(object sender, EventArgs e)
        {
			// 
            // if the directory doesn't exist, create it
			//
			if (!Directory.Exists(dir))
				Directory.CreateDirectory(dir);
            decimal[] newmylist = { 2m, 3m, 5m, 6m, 7m };
            List<decimal> mylist = new List<decimal>();
            foreach (decimal d in newmylist)
                mylist.Add(d);
            // retrieve first value from list
            decimal myfirst = mylist[0];  // myfirst = 2
            // display in message box
            string myliststring = "";
            foreach (decimal d in mylist)
                myliststring += d.ToString() + "\n";
            MessageBox.Show(myliststring, "Hi");

			
            
            // create the output stream for a text file that exists
			StreamWriter textOut = 
				new StreamWriter(
				new FileStream(path, FileMode.Create, FileAccess.Write));
			// write each mylist
                textOut.Write( "|");
                textOut.Write(myliststring);
                textOut.WriteLine("hi");
			// close the output stream for the text file
			textOut.Close();
	    }

        private void btnReadFile_Click(object sender, EventArgs e)
        {

            //create the object for the input stream for a text file
            StreamReader textIn = 
            new StreamReader(
            new FileStream(path, FileMode.OpenOrCreate,FileAccess.Read));
            // create the list
            // read the data from the file and store it in the list
            //
            while (textIn.Peek() != -1)
            {
                string myliststring = "";
             string row = textIn.ReadLine();
             string[] columns = row.Split('|');
             decimal[] newmylist = { 2m, 3m, 5m, 6m, 7m };
             List<decimal> mylist = new List<decimal>();
                 foreach (decimal d in mylist)
                 myliststring += d.ToString() + "\n";
             MessageBox.Show(myliststring, "Bye");
         
            }
            // close the input stream for the text file
            textIn.Close();
        }
    }
}