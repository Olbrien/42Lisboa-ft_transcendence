#### ######## #### #### ######## #### #### ######## #### #### ######## #### #### ######## ####

all: clear message info

up: create_volumes
	@cd srcs && docker-compose up --build;

up_detached: create_volumes
	@cd srcs && docker-compose up -d --build;

down:
	@echo "Down!";
	@cd srcs && docker-compose down

restart:
	@docker exec -it nestjs /usr/local/bin/npm run prebuild;
	@docker stop $$(docker ps -aq);
	@docker start $$(docker ps -aq);

clean:
	@echo "Clean!";
	@cd srcs && docker-compose down
	@docker volume rm $$(docker volume ls -qf "dangling="true"") || true

fclean:	clean 
	@echo "FClean!";
	@cd srcs && docker system prune -a --volumes

re:		fclean up

#### ######## #### #### ######## #### #### ######## #### #### ######## #### #### ######## ####

prod: prod_env up
dev:  dev_env up_detached

prod_env:
	@if [ -f srcs/.env ]; then \
		sed -i 's/ENVIRONMENT=.*/ENVIRONMENT=prod/g' srcs/.env; \
	else \
		printf "\n\033[3;31m !! You need to add the .env variable !! \e[0m \n\n"; \
	fi

dev_env:
	@if [ -f srcs/.env ]; then \
		sed -i 's/ENVIRONMENT=.*/ENVIRONMENT=dev/g' srcs/.env; \
	else \
		printf "\n\033[3;31m !! You need to add the .env variable !! \e[0m \n\n"; \
	fi

#### ######## #### #### ######## #### #### ######## #### #### ######## #### #### ######## ####

VOLUMES_LOCATION = ./srcs/volumes

create_volumes:
	@mkdir -p ${VOLUMES_LOCATION}/postgres/data

volume_up:
	@docker exec -it postgres chmod -R 777 "/var/lib/postgresql/"
	@docker exec -it nestjs chmod -R 777 "/usr/src/app/"

volume_down:
	@sudo rm -fr ./srcs/volumes/*

#### ######## #### #### ######## #### #### ######## #### #### ######## #### #### ######## ####

clear:
	@clear

message:
	@printf "\n"
	@printf "\033[1;36m	!! ft_transcendence by jceia, tisantos @42Lisboa !! \e[0m \n"
	@printf "\033[1;35m		!! ft_transcendence by jceia, tisantos @42Lisboa !! \e[0m \n"
	@printf "\033[1;31m			!! ft_transcendence by jceia, tisantos @42Lisboa !! \e[0m \n"
	@printf "\033[1;38m				!! ft_transcendence by jceia, tisantos @42Lisboa !! \e[0m \n"
	@printf "\n"

info:	
	@printf "\n  \033[1;32mFor Production use 'make prod'.\e[0m";
	@printf "\n  \033[1;31mFor Development use 'make dev'. \e[0m \n";
	@printf "\n  \033[1;36m'make restart' to delete '/dist/' from @nestjs' + docker stop + docker start.\e[0m";
	@printf "\n  \033[1;36m'make down' to docker-compose down.\e[0m";
	@printf "\n  \033[1;36m'make clean' to docker-compose down + remove docker volume.\e[0m";
	@printf "\n  \033[1;36m'make fclean' to docker-compose down + docker system prune -a --volumes.\e[0m\n";
	@printf "\n  \033[4;29mTo set volume folders permissions use 'make volume_up'\e[0m";	
	@printf "\n  \033[4;29mTo delete volume folders use 'make volume_down'\e[0m \n\n\n";

#### ######## #### #### ######## #### #### ######## #### #### ######## #### #### ######## ####
