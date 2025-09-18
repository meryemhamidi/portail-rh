import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon as FileText,
  UserIcon as User,
  CurrencyDollarIcon as DollarSign,
  UsersIcon as Users,
  BriefcaseIcon as Briefcase,
  XMarkIcon as X,
  CalendarIcon as Calendar
} from '@heroicons/react/24/outline';
import { Document } from '../../types/index';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Données simulées
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Fiche de paie - Décembre 2024',
        type: 'payslip',
        url: '/documents/payslip_dec_2024.pdf',
        uploadDate: '2024-12-31T23:59:59Z',
        size: 245760
      },
      {
        id: '2',
        name: 'Fiche de paie - Novembre 2024',
        type: 'payslip',
        url: '/documents/payslip_nov_2024.pdf',
        uploadDate: '2024-11-30T23:59:59Z',
        size: 238945
      },
      {
        id: '3',
        name: 'Contrat de travail CDI',
        type: 'contract',
        url: '/documents/contract_cdi.pdf',
        uploadDate: '2024-01-15T10:30:00Z',
        size: 512000
      },
      {
        id: '4',
        name: 'Certificat formation React',
        type: 'certificate',
        url: '/documents/cert_react.pdf',
        uploadDate: '2024-03-20T14:15:00Z',
        size: 156789
      },
      {
        id: '5',
        name: 'Attestation employeur',
        type: 'other',
        url: '/documents/attestation.pdf',
        uploadDate: '2024-06-10T09:45:00Z',
        size: 89456
      },
      {
        id: '6',
        name: 'Fiche de paie - Octobre 2024',
        type: 'payslip',
        url: '/documents/payslip_oct_2024.pdf',
        uploadDate: '2024-10-31T23:59:59Z',
        size: 241230
      }
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'payslip':
        return <DocumentArrowDownIcon className="h-8 w-8 text-green-600" />;
      case 'contract':
        return <DocumentTextIcon className="h-8 w-8 text-blue-600" />;
      case 'certificate':
        return <DocumentTextIcon className="h-8 w-8 text-purple-600" />;
      default:
        return <FolderIcon className="h-8 w-8 text-gray-600" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'payslip': return 'Fiche de paie';
      case 'contract': return 'Contrat';
      case 'certificate': return 'Certificat';
      default: return 'Autre';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (doc: Document) => {
    // Génération HTML pour impression PDF
    const generateHTMLForPrint = (document: Document) => {
      const currentDate = new Date().toLocaleDateString('fr-FR');
      
      let content = '';
      
      if (document.type === 'payslip') {
        const period = document.name.includes('Décembre') ? 'Décembre 2024' : 
                      document.name.includes('Novembre') ? 'Novembre 2024' : 'Octobre 2024';
        content = `
          <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #008080; padding-bottom: 20px;">
              <h1 style="color: #008080; font-size: 32px; margin: 0;">TEAL TECHNOLOGY SERVICES</h1>
              <p style="color: #666; margin: 5px 0;">Portail RH International</p>
              <h2 style="color: #333; font-size: 24px; margin: 20px 0;">BULLETIN DE PAIE</h2>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
                <h3 style="color: #007bff; margin-top: 0;">Informations Employé</h3>
                <p><strong>Période:</strong> ${period.replace('2024', '2025')}</p>
                <p><strong>Employé:</strong> Utilisateur Test</p>
                <p><strong>Poste:</strong> Développeur Full Stack</p>
                <p><strong>Département:</strong> IT</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <h3 style="color: #28a745; margin-top: 0;">Détails du Salaire</h3>
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span>Salaire brut:</span>
                    <strong style="color: #28a745;">35,000.00 DH</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span>Cotisations sociales:</span>
                    <strong style="color: #dc3545;">-8,500.00 DH</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px;">
                    <strong>Salaire net:</strong>
                    <strong style="color: #28a745; font-size: 20px;">26,500.00 DH</strong>
                  </div>
                </div>
                <div style="background: #fff3cd; padding: 10px; border-radius: 5px; text-align: center;">
                  <strong>Congés restants: 18 jours</strong>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              Document généré automatiquement par le Portail RH Teal Technology Services - ${currentDate}
            </div>
          </div>
        `;
      } else if (document.type === 'contract') {
        content = `
          <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #008080; padding-bottom: 20px;">
              <h1 style="color: #008080; font-size: 32px; margin: 0;">TEAL TECHNOLOGY SERVICES</h1>
              <p style="color: #666; margin: 5px 0;">Portail RH International</p>
              <h2 style="color: #333; font-size: 24px; margin: 20px 0;">📋 CONTRAT DE TRAVAIL - CDI</h2>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Parties contractantes</h3>
              <p><strong>Employeur:</strong> Teal Technology Services</p>
              <p><strong>Employé:</strong> Utilisateur Test</p>
              <p><strong>Poste:</strong> Développeur Full Stack</p>
              <p><strong>Date d'embauche:</strong> 15/01/2024</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 5px;">Conditions d'emploi</h3>
              <ul style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <li><strong>Salaire:</strong> 420,000 DH brut annuel</li>
                <li><strong>Période d'essai:</strong> 3 mois</li>
                <li><strong>Durée de travail:</strong> 35h/semaine</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #17a2b8; border-bottom: 2px solid #17a2b8; padding-bottom: 5px;">Avantages</h3>
              <ul style="background: #e7f3ff; padding: 20px; border-radius: 8px;">
                <li>Tickets restaurant</li>
                <li>Mutuelle d'entreprise</li>
                <li>25 jours de congés payés</li>
                <li>Télétravail 2 jours/semaine</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              Document généré automatiquement par le Portail RH Teal Technology Services - ${currentDate}
            </div>
          </div>
        `;
      } else if (document.type === 'certificate') {
        content = `
          <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #6f42c1; padding-bottom: 20px;">
              <h1 style="color: #6f42c1; font-size: 32px; margin: 0;">TEAL ACADEMY</h1>
              <h2 style="color: #333; font-size: 24px; margin: 20px 0;">🎓 CERTIFICAT DE FORMATION</h2>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px; background: #f8f9fa; padding: 30px; border-radius: 10px;">
              <h3 style="color: #6f42c1; font-size: 28px; margin-bottom: 20px;">React Avancé</h3>
              <p><strong>Organisme:</strong> Teal Academy</p>
              <p><strong>Durée:</strong> 40 heures</p>
              <p><strong>Date:</strong> Mars 2024</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="color: #6f42c1; border-bottom: 2px solid #6f42c1; padding-bottom: 5px;">Compétences acquises</h3>
              <ul style="background: #f3e5f5; padding: 20px; border-radius: 8px;">
                <li>Hooks avancés (useState, useEffect, useContext)</li>
                <li>Context API et gestion d'état globale</li>
                <li>Optimisation des performances</li>
                <li>Testing avec Jest et React Testing Library</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0; padding: 20px; background: #e9ecef; border-radius: 10px;">
              <p style="font-size: 18px; margin: 0;"><strong>Certification validée par:</strong></p>
              <p style="font-size: 20px; color: #6f42c1; margin: 10px 0;"><strong>Formateur Expert React</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              Document généré automatiquement par le Portail RH Teal Technology Services - ${currentDate}
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #008080; padding-bottom: 20px;">
              <h1 style="color: #008080; font-size: 32px; margin: 0;">TEAL TECHNOLOGY SERVICES</h1>
              <p style="color: #666; margin: 5px 0;">Portail RH International</p>
              <h2 style="color: #333; font-size: 24px; margin: 20px 0;">📝 ATTESTATION EMPLOYEUR</h2>
            </div>
            
            <div style="text-align: center; margin: 40px 0; font-size: 18px; line-height: 1.8;">
              <p>Nous attestons que <strong>M./Mme Utilisateur Test</strong> est employé(e) dans notre entreprise depuis le <strong>15/01/2024</strong> en qualité de <strong>Développeur Full Stack</strong>.</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; margin: 10px 0;"><strong>Salaire brut mensuel:</strong> 35,000 DH</p>
              <p style="font-size: 16px; margin: 10px 0;"><strong>Type de contrat:</strong> CDI à temps plein</p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <p style="font-size: 16px;">Cette attestation est délivrée pour servir et valoir ce que de droit.</p>
            </div>
            
            <div style="text-align: right; margin: 40px 0; font-size: 16px;">
              <p><strong>Fait à Paris, le ${currentDate}</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              Document généré automatiquement par le Portail RH Teal Technology Services - ${currentDate}
            </div>
          </div>
        `;
      }

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${document.name}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              background: white;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;
    };

    // Créer le contenu HTML
    const htmlContent = generateHTMLForPrint(doc);
    
    // Créer un blob avec le contenu HTML
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Ouvrir dans une nouvelle fenêtre pour impression PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Attendre que le contenu soit chargé puis déclencher l'impression
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 500);
      };
    }
    
    URL.revokeObjectURL(url);
    alert(`Document "${doc.name}" ouvert pour impression PDF !`);
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-teal-primary mr-3" />
            Mes Documents
          </h1>
          <p className="text-gray-600 mt-1">
            Accédez à tous vos documents administratifs
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {documents.length} document(s) disponible(s)
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentArrowDownIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fiches de paie</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.type === 'payslip').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contrats</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.type === 'contract').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certificats</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.type === 'certificate').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FolderIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Autres</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.type === 'other').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les types</option>
            <option value="payslip">Fiches de paie</option>
            <option value="contract">Contrats</option>
            <option value="certificate">Certificats</option>
            <option value="other">Autres</option>
          </select>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Documents disponibles</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getDocumentIcon(document.type)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{document.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {getDocumentTypeLabel(document.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(document.size)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(document)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    title="Aperçu"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="p-2 text-teal-600 hover:text-teal-800 rounded-full hover:bg-teal-50"
                    title="Télécharger"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun document ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Modal d'aperçu du document */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedDocument.name}</h2>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {selectedDocument.uploadDate}
                      </span>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {formatFileSize(selectedDocument.size)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Header professionnel */}
                <div className="text-center mb-8 pb-6 border-b border-gray-200">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-teal-600 mb-2">TEAL TECHNOLOGY SERVICES</h1>
                    <p className="text-gray-600 text-sm uppercase tracking-wide">Portail RH International</p>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800 uppercase tracking-wide">
                      {selectedDocument.type === 'payslip' && 'BULLETIN DE PAIE'}
                      {selectedDocument.type === 'contract' && 'CONTRAT DE TRAVAIL - CDI'}
                      {selectedDocument.type === 'certificate' && 'CERTIFICAT DE FORMATION'}
                      {selectedDocument.type === 'attestation' && 'ATTESTATION EMPLOYEUR'}
                    </h2>
                    <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {selectedDocument.uploadDate}
                      </span>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {formatFileSize(selectedDocument.size)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedDocument.type === 'payslip' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section Informations Employé */}
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-slate-600" />
                        Informations Employé
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-600">Période:</span>
                          <span className="font-medium text-slate-900">
                            {selectedDocument.name.includes('Décembre') ? 'Décembre 2025' : 
                             selectedDocument.name.includes('Novembre') ? 'Novembre 2025' : 'Octobre 2025'}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-600">Employé:</span>
                          <span className="font-medium text-slate-900">Utilisateur Test</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-600">Poste:</span>
                          <span className="font-medium text-slate-900">Développeur Full Stack</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-600">Département:</span>
                          <span className="font-medium text-slate-900">IT</span>
                        </div>
                      </div>
                    </div>

                    {/* Section Détails Salaire */}
                    <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                        Détails du Salaire
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-emerald-100">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Salaire brut:</span>
                            <span className="font-semibold text-emerald-600 text-lg">35,000.00 DH</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Cotisations sociales:</span>
                            <span className="font-semibold text-red-600">-8,500.00 DH</span>
                          </div>
                          <div className="flex justify-between items-center py-3 mt-2 bg-emerald-600 text-white px-4 rounded-lg">
                            <span className="font-bold">Salaire net:</span>
                            <span className="font-bold text-xl">26,500.00 DH</span>
                          </div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                          <span className="text-amber-800 font-medium">Congés restants: </span>
                          <span className="font-bold text-amber-900 text-lg">18 jours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDocument.type === 'contract' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-600" />
                          Parties contractantes
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-blue-200">
                            <span className="text-blue-600">Employeur:</span>
                            <span className="font-medium text-blue-900">Teal Technology Services</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-blue-200">
                            <span className="text-blue-600">Employé:</span>
                            <span className="font-medium text-blue-900">Utilisateur Test</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-blue-200">
                            <span className="text-blue-600">Poste:</span>
                            <span className="font-medium text-blue-900">Développeur Full Stack</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-blue-600">Date d'embauche:</span>
                            <span className="font-medium text-blue-900">15/01/2025</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                          <Briefcase className="h-5 w-5 mr-2 text-emerald-600" />
                          Conditions d'emploi
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-emerald-200">
                            <span className="text-emerald-600">Salaire:</span>
                            <span className="font-medium text-emerald-900">420,000 DH brut annuel</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-emerald-200">
                            <span className="text-emerald-600">Période d'essai:</span>
                            <span className="font-medium text-emerald-900">3 mois</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-emerald-600">Durée de travail:</span>
                            <span className="font-medium text-emerald-900">35h/semaine</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3">Avantages</h3>
                      <div className="bg-teal-50 p-4 rounded">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Tickets restaurant</li>
                          <li>Mutuelle d'entreprise</li>
                          <li>25 jours de congés payés</li>
                          <li>Télétravail 2 jours/semaine</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDocument.type === 'certificate' && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-teal-600 mb-2">TEAL ACADEMY</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">Détails de la formation</h3>
                        <p><strong>Formation:</strong> React Avancé</p>
                        <p><strong>Organisme:</strong> Teal Academy</p>
                        <p><strong>Durée:</strong> 40 heures</p>
                        <p><strong>Date:</strong> Mars 2025</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">Compétences acquises</h3>
                        <div className="bg-purple-50 p-4 rounded">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Hooks avancés (useState, useEffect, useContext)</li>
                            <li>Context API et gestion d'état globale</li>
                            <li>Optimisation des performances</li>
                            <li>Testing avec Jest et React Testing Library</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-8 p-4 bg-gray-50 rounded">
                      <p className="font-bold">Certification validée par:</p>
                      <p className="text-lg">Formateur Expert React</p>
                    </div>
                  </div>
                )}

                {selectedDocument.type === 'other' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-lg leading-relaxed">
                        Nous attestons que <strong>M./Mme Utilisateur Test</strong> est employé(e) dans notre entreprise 
                        depuis le <strong>15/01/2024</strong> en qualité de <strong>Développeur Full Stack</strong>.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded text-center">
                      <p><strong>Salaire brut mensuel:</strong> 35,000 DH</p>
                      <p><strong>Type de contrat:</strong> CDI à temps plein</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-4">Cette attestation est délivrée pour servir et valoir ce que de droit.</p>
                      <p className="text-right font-semibold">
                        Fait à Paris, le {new Date().toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                  Document généré automatiquement par le Portail RH Teal Technology Services - {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedDocument);
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
