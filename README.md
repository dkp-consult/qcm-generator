# Le projet
Il s'agit d'un générateur de code pour un QCM. Vous encodez vos différentes questions, et potentiellement une image. 

Par la suite il est possible de prévisualiser le rendu du code et vérifier son efficacité, et la sortie est un code à copier / coller pour l'intégrer. 

Un style simpliste est appliqué, mais il est modifiable à souhait. 

## Les raisons 

Dans le cadre d'une mission de Webmaster, il m'a été demandé de proposer un générateur de QCM pour l'utilisateur final, sur un site WP. Ma contraintes principal était d'éviter l'utilisation d'un plugin autant que possible. 

## Ma réflexions

Pour ne pas devoir utiliser de plugins et rendre simple la mise en place de qcm pour l'utilisateur final, le mieux était de lui fournir une interface qui génère le code à utiliser. 

Si l'utilisateur devait modifier lui-même un code déjà mis en place, les erreurs et les problèmes de syntaxes auraient été légions.

## Les contraintes

WP bloque pas mal d'exécution de JS et de manipulation du DOM de manière dynamique, lors de mes premiers essais, je ne parvenais pas à avoir la correction du code et le refresh au clic sur le bouton de vérification. 

De plus, j'ai pendant un temps rencontré un problème sur la page de création qui ne rafraichissait pas correctement la preview.

## Ma solution

Pour éviter de bloquer sur cela, j'ai finis par utiliser un iFrame sur la page de preview qui se reset à chaque nouvelle génération. 






