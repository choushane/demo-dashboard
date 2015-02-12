<?php

    namespace Modules;

    class temperature extends \ld\Modules\Module {
        protected $name = 'temperature';
        protected $raw_output = true;

        public function getData($args=array()) {
			$data = array();
			
			exec(
                "/bin/cat /home/linaro/003/oo.log",
                $result
            );
	    //return shell_exec('/bin/cat /home/linaro/003/oo.log');
	    return $result;

            $result = array_filter($result);

		foreach ($result as $a) {
		$p = explode(':', $a);

                //$data[$p[0]] = $p[1];
		return $p[1];
		break;
            }
			
			return $data;
        }
    }
