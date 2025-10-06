import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';

const SubscriptionManager: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, clearSubscription } = useAppStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
      clearSubscription();
      navigate('/subscription');
    }
  };

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  if (!subscription || !subscription.isActive) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucun abonnement actif</h3>
          <p className="text-gray-400 mb-6">
            Abonnez-vous pour accéder à toutes les chaînes premium
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Voir les abonnements
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Abonnement {subscription.planName}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Actif
            </span>
            <span>{daysRemaining} jours restants</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {formatPrice(subscription.price)}
            <span className="text-sm font-normal text-gray-400 ml-1">XOF</span>
          </div>
          <div className="text-sm text-gray-400">par mois</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Date de début</div>
          <div className="text-white font-semibold">
            {formatDate(subscription.startDate)}
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Prochaine facturation</div>
          <div className="text-white font-semibold">
            {formatDate(subscription.endDate)}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleUpgrade}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Changer de plan
        </button>
        <button
          onClick={handleCancelSubscription}
          className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
        >
          Annuler l'abonnement
        </button>
      </div>

      {daysRemaining <= 7 && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-300 text-sm">
              Votre abonnement expire bientôt. Renouvelez-le pour continuer à profiter de nos services.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
